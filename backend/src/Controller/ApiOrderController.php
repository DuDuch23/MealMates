<?php
namespace App\Controller;

use App\Entity\User;
use App\Entity\Order;
use App\Enum\OfferStatus;
use App\Entity\Notification;
use App\Repository\UserRepository;
use App\Repository\OfferRepository;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Trait\MailerTrait;

#[Route('/api/order', name: 'api_order_')]
class ApiOrderController extends AbstractController
{
    use MailerTrait;
    
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    #[Route('/create', name: 'api_order_create', methods: ['POST'])]
    public function create(Request $request,OfferRepository $offerRepository,OrderRepository $orderRepository,EntityManagerInterface $em,#[CurrentUser] ?User $user): JsonResponse 
    {
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

        // on change l'état de l'offre
        $offer->setStatus(OfferStatus::RESERVED);
        $em->persist($offer);
        $em->flush();
        
        // on envoie le mail
        $this->sendMail(
            'mealmates.g5@gmail.com',
            $offer->getSeller()->getEmail(),
            'Nouvelle réservation',
            '',
            'emails/orderReservation.html.twig',
            [
                "offer" => $offer,
                "seller" => $offer->getSeller(),
            ],
            $this->mailer,
        );

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