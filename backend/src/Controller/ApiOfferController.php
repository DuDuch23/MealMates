<?php
namespace App\Controller;

use App\Entity\Offer;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/offers', name: 'api_offer')]
class ApiOfferController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager, SerializerInterface $serializer, Request $request): JsonResponse
    {
        $offers = $entityManager->getRepository(Offer::class)->findAll();

        if (empty($offers)) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "No offers found."
            ], 404);
        }

        $offersSerialized = $serializer->serialize($offers, 'json', ['groups' => 'public']);

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => json_decode($offersSerialized, true),
        ], 200);
    }

    #[Route('/get', methods: ['POST'])]
    public function get(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id'])) {
            return $this->json([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'id' parameter."
            ], 400);
        }

        $offer = $entityManager->getRepository(Offer::class)->find($data['id']);
        if (!$offer) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "Offer doesn't exist."
            ], 404);
        }

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => json_decode($serializer->serialize($offer, 'json', ['groups' => 'public']), true),
        ], 200);
    }

    #[Route('/new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'])) {
            return $this->json([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'name' parameter."
            ], 400);
        }

        $existingOffer = $entityManager->getRepository(Offer::class)->findOneBy(['name' => $data['name']]);
        if ($existingOffer) {
            return $this->json([
                'status' => "Forbidden",
                'code' => 403,
                'message' => "Offer already exists."
            ], 403);
        }

        $offer = new Offer();
        $offer->setProduct($data['product']);
        $offer->setDescription($data['description']);
        $offer->setQuantity($data['quantity']);
        $offer->setExpirationDate(new \DateTime($data['expirationDate']));
        $offer->setPrice($data['price']);
        $offer->setIsDonation($data['isDonation']);
        $offer->setPickupLocation($data['pickupLocation']);
        $offer->setAvailableSlots($data['availableSlots']);
        $offer->setIsRecurring($data['isRecurring']);
        $offer->setPhotosFileOffers($data['photos_offer']);
        // $offer->setCreatedAt(new \DateTimeImmutable());
        $offer->setUpdatedAt(new DateTimeImmutable());
        $offer->setUser($this->getUser()); // Assurez-vous que l'utilisateur est connecté


        $entityManager->persist($offer);
        $entityManager->flush();

        return $this->json([
            'status' => "Created",
            'code' => 201,
        ], 201);
    }

    #[Route('/edit', methods: ['PUT'])]
    public function edit(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id']) || !isset($data['name'])) {
            return $this->json([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'id' or 'name' parameter."
            ], 400);
        }

        $offer = $entityManager->getRepository(Offer::class)->find($data['id']);
        if (!$offer) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "Offer doesn't exist."
            ], 404);
        }

        // Vérification des permissions (seul un admin ou le propriétaire peut éditer)
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json([
                'status' => "Unauthorized",
                'code' => 401,
                'message' => "You are not authorized to perform this action."
            ], 401);
        }

        $offer->setName($data['name']);

        $entityManager->flush();

        return $this->json([
            'status' => "OK",
            'code' => 200,
        ], 200);
    }

    #[Route('/delete', methods: ['DELETE'])]
    public function delete(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id'])) {
            return $this->json([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'id' parameter."
            ], 400);
        }

        $offer = $entityManager->getRepository(Offer::class)->find($data['id']);
        if (!$offer) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "Offer doesn't exist."
            ], 404);
        }

        // Vérification des permissions
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json([
                'status' => "Unauthorized",
                'code' => 401,
                'message' => "You are not authorized to perform this action."
            ], 401);
        }

        $entityManager->remove($offer);
        $entityManager->flush();

        return $this->json([
            'status' => "OK",
            'code' => 200,
        ], 200);
    }
}
