<?php
namespace App\Controller;

use App\Entity\Offer;
use App\Entity\Order;
use App\Repository\OfferRepository;
use App\Repository\OrderRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api/order', name: 'api_order_')]
class ApiOrderController extends AbstractController
{
    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        OfferRepository $offerRepository,
        OrderRepository $orderRepository,
        EntityManagerInterface $em,
        #[CurrentUser] $user
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $offerId = $data['offerId'] ?? null;

        if (!$offerId) {
            return $this->json(['error' => 'Missing offer ID'], 400);
        }

        $offer = $offerRepository->find($offerId);
        if (!$offer) {
            return $this->json(['error' => 'Offer not found'], 404);
        }

        // Vérifier si offre déjà réservée
        $existing = $orderRepository->findOneBy(['offer' => $offer]);
        if ($existing && !$existing->isConfirmed()) {
            return $this->json(['error' => 'Cette offre est déjà réservé'], 409);
        }

        $order = new Order();
        $order->setBuyer($user);
        $order->setOffer($offer);
        $order->setExpiresAt((new \DateTimeImmutable())->modify('+1 hour')); // timeout d'1h

        $em->persist($order);
        $em->flush();

        // TODO : envoyer notification au vendeur

        return $this->json([
            'success' => true,
            'order' => [
                'id' => $order->getId(),
                'isConfirmed' => $order->isConfirmed(),
                'expiresAt' => $order->getExpiresAt()->format('Y-m-d H:i:s'),
                'purchasedAt' => $order->getPurchasedAt()->format('Y-m-d H:i:s'),
                'buyer' => [
                    'id' => $user->getId(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                ]
            ]
        ]);
    }


}
