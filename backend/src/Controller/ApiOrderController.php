<?php
namespace App\Controller;

use App\Entity\Notification;
use App\Entity\Order;
use App\Repository\OfferRepository;
use App\Repository\OrderRepository;
use App\Repository\UserRepository;
use App\Entity\User;
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
        #[CurrentUser] ?User $user
    ): JsonResponse {
        if (!$user) {
            return $this->json(['error' => 'Unauthenticated'], 401);
        }

        $data = json_decode($request->getContent(), true);
        $offerId = $data['offerId'] ?? null;

        if (!$offerId) {
            return $this->json(['error' => 'Missing offer ID'], 400);
        }

        $offer = $offerRepository->find($offerId);
        if (!$offer) {
            return $this->json(['error' => 'Offer not found'], 404);
        }

        if ($orderRepository->findOneBy(['offer' => $offer, 'isConfirmed' => false])) {
            return $this->json(['error' => 'Cette offre est déjà réservée'], 409);
        }

        $order = (new Order())
            ->setBuyer($user)
            ->setOffer($offer)
            ->setPurchasedAt(new \DateTimeImmutable())
            ->setIsConfirmed(false)
            ->setExpiresAt(new \DateTimeImmutable('+1 hour'));

        $em->persist($order);
        $em->flush();

        // $notification = (new Notification())
        //     ->setUser($offer->getSeller())
        //     ->setTitle('Nouvelle réservation')
        //     ->setMessage(sprintf(
        //         'L’offre « %s » a été réservée par %s %s.',
        //         $offer->getProduct(),
        //         $user->getFirstName(),
        //         $user->getLastName()
        //     ))
        //     ->setType('reservation_request')
        //     ->setTargetId($order->getId());

        // $em->persist($notification);
        // $em->flush();

        return $this->json([
            'order' => [
                'id'          => $order->getId(),
                'isConfirmed' => $order->isConfirmed(),
                'expiresAt'   => $order->getExpiresAt()->format('Y-m-d H:i:s'),
                'purchasedAt' => $order->getPurchasedAt()->format('Y-m-d H:i:s'),
            ],
        ], 201);
    }
}