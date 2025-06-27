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
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiPaymentController extends AbstractController
{
    #[Route('/api/chat/{id}/create-stripe', name: 'api_create_stripe', methods: ['POST'])]
    public function createStripeSession( int $id,EntityManagerInterface $em,Security $security): JsonResponse 
    {
        $chat = $em->getRepository(Chat::class)->find($id);
        // return new JsonResponse(['error' => $chat] , 404 , ['groups' => ['chat:private']]);
        if (!$chat || !$chat->getOffer()) {
            return new JsonResponse(['error' => 'Chat ou offre introuvable'], 404);
        }

        $user = $security->getUser();
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
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => 'https://localhost:5173/success',
            'cancel_url' => 'http://localhost:5173/cancel',
        ]);

        $chat->setStripeUrl($session->url);
        $em->flush();

        return new JsonResponse(['url' => $session->url]);
    }
}
