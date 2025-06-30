<?php

namespace App\Controller;

use Stripe\Stripe;
use App\Entity\Chat;
use Stripe\Checkout\Session;
use Endroid\QrCode\Builder\Builder;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiStripeController extends AbstractController
{
    #[Route('/api/chat/{id}/create-payment', name: 'chat_create_payment', methods: ['POST'])]
    public function createPayment(int $id, EntityManagerInterface $em): JsonResponse
    {
        $chat = $em->getRepository(Chat::class)->find($id);
        if (!$chat || !$chat->getOffer()) {
            return new JsonResponse(['error' => 'Chat ou offre non trouvée'], 404);
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
            'success_url' => 'https://mealmates/success',
            'cancel_url' => 'https://mealmates/cancel',
        ]);

        return new JsonResponse([
            'stripe_url' => $session->url,
            'qr_code_url' => '/api/qr-code?url=' . urlencode($session->url),
        ]);
    }
}