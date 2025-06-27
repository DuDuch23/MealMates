<?php

namespace App\Controller;


use Stripe\Stripe;
use App\Entity\Chat;
use App\Entity\User;
use Stripe\Checkout\Session;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiPaymentController extends AbstractController
{
    #[Route('/api/chat/{id}/create-stripe', name: 'api_create_stripe', methods: ['POST'])]
    public function createStripeSession( int $id,EntityManagerInterface $em,Security $security,SerializerInterface $serializer): JsonResponse 
    {
        $chat = $em->getRepository(Chat::class)->find($id);

        if (!$chat || !$chat->getOffer()) {
            return new JsonResponse(['error' => 'Chat ou offre introuvable'], 404);
        }

        $user = $security->getUser();

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
        }

        if ($chat->getSeller()->getId() !== $user->getId()) {
            // Sérialise l'utilisateur en JSON avec le groupe 'public'
            $userDataJson = $serializer->serialize($user, 'json', ['groups' => ['public']]);
            $chat = $serializer->serialize($chat, 'json', ['groups' => ['public']]);
            // Décode en tableau pour l'envoyer dans JsonResponse
            $userData = json_decode($userDataJson, true);
            $chat = json_decode($chat,true);

            return new JsonResponse([
                'error' => 'Non autorisé',
            ], 403);
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
                'quantity' => (int)($chat->getOffer()->getQuantity()),
            ]],
            'mode' => 'payment',
            'success_url' => 'http://localhost:5173/success',
            'cancel_url' => 'http://localhost:5173/cancel',
        ]);

        $chat->setStripeUrl($session->url);
        $em->flush();

        return new JsonResponse(['url' => $session->url,"stripe" => $session]);
    }
}
