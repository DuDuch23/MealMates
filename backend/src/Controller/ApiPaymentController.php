<?php

namespace App\Controller;

use Stripe\Stripe;
use App\Entity\Chat;
use App\Entity\User;
use App\Entity\Order;
use App\Enum\OfferStatus;
use Stripe\Checkout\Session;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Trait\MailerTrait;

class ApiPaymentController extends AbstractController
{
    use MailerTrait;

    private MailerInterface $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    #[Route('/api/chat/{id}/create-stripe', name: 'api_create_stripe', methods: ['POST'])]
    public function createStripeSession(int $id,EntityManagerInterface $entityManager,Security $security,UrlGeneratorInterface $urlGenerator): JsonResponse|RedirectResponse 
    {
        $chat = $entityManager->getRepository(Chat::class)->find($id);

        if (!$chat || !$chat->getOffer()) {
            return new JsonResponse(['error' => 'Chat ou offre introuvable'], 404);
        }
        $frontUrl = $_ENV['FRONT_LINK'];

        $order = $entityManager->getRepository(Order::class)->findOneBy(['offer' => $chat->getOffer()]);

        if (!$order) {
            // Redirige vers la création d'une commande si elle n'existe pas
            return $this->redirectToRoute('/api/order/create', ['offerId' => $chat->getOffer()->getId()]);
        }

        $user = $security->getUser();

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
        }

        if ($chat->getSeller()->getId() !== $user->getId()) {
            return new JsonResponse(['error' => 'Non autorisé'], 403);
        }

        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

        $session = Session::create([
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $chat->getOffer()->getProduct(),
                    ],
                    'unit_amount' => (int)($chat->getOffer()->getPrice() * 100),
                ],
                'quantity' => $chat->getOffer()->getQuantity(),
            ]],
            'mode' => 'payment',
            'success_url' => $urlGenerator->generate('api_success', [
                'chat_id' => $chat->getId(),
                'user_id' => $user->getId(),
                'order_id' => $order->getId(),
                'quantity' => $chat->getOffer()->getQuantity(),
            ], UrlGeneratorInterface::ABSOLUTE_URL),
            
            'cancel_url' => $urlGenerator->generate('api_cancel', [], UrlGeneratorInterface::ABSOLUTE_URL),

        ]);

        $chat->setStripeUrl($session->url);
        $entityManager->persist($chat);
        $entityManager->flush();

        return new JsonResponse(['url' => $session->url]);
    }

    #[Route('/cancel', name: 'api_cancel')]
    public function cancel(): JsonResponse
    {
        return $this->json(['message' => 'Paiement annulé']);
    }


    #[Route('/success', name: 'api_success', methods: ['GET', 'POST'])]
    public function successStripe(Request $request, EntityManagerInterface $entityManager): JsonResponse|RedirectResponse
    {
        $frontUrl = $_ENV['FRONT_LINK'];
        
        // Récupération sécurisée des paramètres (GET ou POST)
        $userId = $request->get('user_id');
        $chatId = $request->get('chat_id');
        $quantity = $request->get('quantity');
        $orderId = $request->get('order_id');

        $user = $entityManager->getRepository(User::class)->find($userId);
        $chat = $entityManager->getRepository(Chat::class)->find($chatId);
        $order = $entityManager->getRepository(Order::class)->find($orderId);

        if (!$chat || !$chat->getOffer()) {
            return new JsonResponse(['error' => 'Chat ou offre introuvable'], 404);
        }

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable'], 404);
        }

        if (!$quantity) {
            return new JsonResponse(['error' => 'Quantité introuvable'], 404);
        }

        if (!$order) {
            return new JsonResponse(['error' => 'Commande introuvable'], 404);
        }

        // Génération d’un mot de passe alphanumérique 6 caractères
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $randomString = '';
        for ($i = 0; $i < 6; $i++) {
            $index = random_int(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }
        $order->setMdp($randomString);
        $entityManager->persist($order);
        $entityManager->flush();

        $client = $chat->getClient();

        // Envoi du mail de confirmation au client
        if ($client && $client->getEmail()) {
            try{
                $this->sendMail(
                    'mealmates.g5@gmail.com',
                    $client->getEmail(),
                    'Confirmation de paiement',
                    '',
                    'emails/confirmationPayment.html.twig',
                    ['client' => $client],
                    $this->mailer
                );
            }catch(\Exception $e){
                 $error = "cotat de mail atteint";
            }
        }

        // Rediriger vers la page de confirmation avec code + mdp dans query string
        return new RedirectResponse("{$frontUrl}/qrcode/{$orderId}?randomString={$randomString}&user={$user->getId()}&chat={$chat->getId()}&quantity={$quantity}");
    }

    #[Route('/confirm/qrcode/{code}', name: 'qr_code_confirm', methods: ['GET'])]
    public function qrCodeConfirm(SerializerInterface $serializer, Request $request, string $code, EntityManagerInterface $entityManager): JsonResponse|RedirectResponse
    {
        $frontUrl = $_ENV['FRONT_LINK'];
        
        $randomString = $request->query->get('randomString');
        $chat = $request->query->get('chat');

        if(!$randomString){
            return new RedirectResponse("{$frontUrl}/404");
        }

        if(!$chat){
            return new RedirectResponse("{$frontUrl}/404");
        }

        $order = $entityManager->getRepository(Order::class)->find((int)$code);
        $chat = $entityManager->getRepository(Chat::class)->find((int)$chat);

        if (!$order || $order->getMdp() !== $randomString) {
            return new RedirectResponse("{$frontUrl}/404");
        }

        if (!$chat) {
           return new RedirectResponse("{$frontUrl}/404");
        }

        $chat->getOffer()->setStatus(OfferStatus::SOLD);

        $chat->setStatus(true);

        // Suppression de la commande / réservation
        $entityManager->persist($chat);
        $entityManager->remove($order);
        $entityManager->flush();

        // Envoi d’un mail de félicitations au vendeur et au client (à compléter)
        try{
            $this->sendMail(
                'mealmates.g5@gmail.com',
                $chat->getClient()->getEmail(),
                'Notification de transaction',
                '',
                'emails/confirmationPayment.html.twig',
                ['client' => $chat->getClient()],
                $this->mailer
            );
        }catch(\Exception $e){
             $error = "cotat de mail atteint";
        }

        try{
            $this->sendMail(
                'mealmates.g5@gmail.com',
                $chat->getSeller()->getEmail(),
                'Notification de transaction',
                '',
                'emails/confirmationPayment.html.twig',
                ['client' => $chat->getSeller()],
                $this->mailer
            );
        }catch(\Exception $e){
             $error = "cotat de mail atteint";
        }

        return new RedirectResponse("{$frontUrl}/confirmation");
    }
}
