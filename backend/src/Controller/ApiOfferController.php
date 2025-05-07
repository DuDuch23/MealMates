<?php
namespace App\Controller;

use App\Entity\User;
use App\Entity\Image;
use App\Entity\Offer;
use DateTimeImmutable;
use App\Repository\OfferRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/offers', name: 'api_offer')]
class ApiOfferController extends AbstractController
{
    #[Route('/', methods: ['GET'])]
    public function getAllOffer(EntityManagerInterface $entityManager, SerializerInterface $serializer, Request $request): JsonResponse
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
            'data' => json_decode($serializer->serialize($offers, 'json', ['groups' => 'public']), true),
        ], 200);
    }

    #[Route('/get/{id}', methods: ['GET'])]
    public function getOfferByID(int $id, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $offer = $entityManager->getRepository(Offer::class)->find($id);

        if (!$offer) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "No offer found."
            ], 404);
        }

        $data = json_decode($serializer->serialize($offer, 'json', ['groups' => 'public']), true);

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => $data,
        ], 200);
    }

    #[Route('/get/seller', methods: ['POST'])]
    public function getBySeller(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id'])) {
            return $this->json([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'id' parameter."
            ], 400);
        }

        $offer = $entityManager->getRepository(Offer::class)->findBy(['seller' => $data['id']]);

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

    #[Route('/vegan', methods: ['GET'])]
    public function getVeganOffers(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): JsonResponse
    {
        $limit = $request->query->getInt('limit', 10);
        $offset = $request->query->getInt('offset', 0);

        $offers = $entityManager->getRepository(Offer::class)->getVeganOffers($limit, $offset);

        if (empty($offers)) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "No vegan offers found."
            ], 404);
        }

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => json_decode($serializer->serialize($offers, 'json', ['groups' => 'public']), true),
        ], 200);
    }

    #[Route('/local', name: 'api_offers_local', methods: ['GET'])]
    public function offersLocal(Request $req, OfferRepository $repo, SerializerInterface $serializer): JsonResponse
    {
        $lat = (float) $req->query->get('lat');
        $lng = (float) $req->query->get('lng');
        $radius = $req->query->getInt('radius', 5);

        if ($lat === null || $lng === null) {
            return $this->json(['error' => 'lat/lng required'], 400);
        }

        $offers = $repo->findOffersLocal($lat, $lng, $radius);

        return $this->json([
            'status' => 'OK',
            'data'   => json_decode($serializer->serialize($offers, 'json', ['groups' => 'public']), true),
        ]);
    }

    #[Route('/last-chance', name: 'api_offers_last_chance', methods: ['GET'])]
    public function getLastChanceOffers(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): JsonResponse
    {
        $limit = $request->query->getInt('limit', 10);
        $offset = $request->query->getInt('offset', 0);

        $offers = $entityManager->getRepository(Offer::class)->findLastChance($limit, $offset);

        if (empty($offers)) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "No vegan offers found."
            ], 404);
        }

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => json_decode($serializer->serialize($offers, 'json', ['groups' => 'public']), true),
        ], 200);
    }

    #[Route('/again', name: 'api_offers_again', methods: ['GET'])]
    public function getAgainOffers(Request $request, SerializerInterface $serializer, 
    Security $security, OfferRepository $offerRepository): JsonResponse
    {
        $limit = $request->query->getInt('limit', 10);
        $offset = $request->query->getInt('offset', 0);
        /** @var User $user */
        $user = $security->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }

        $offers = $offerRepository->findOffersBoughtByUser($user->getId());

        if (empty($offers)) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "No again offers found."
            ], 404);
        }

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => json_decode($serializer->serialize($offers, 'json', ['groups' => 'public']), true),
        ], 200);
    }

    #[Route('/new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // if (!isset($data['name'])) {
        //     return $this->json([
        //         'status' => "Bad Request",
        //         'code' => 400,
        //         'message' => "Missing 'name' parameter."
        //     ], 400);
        // }

        // $existingOffer = $entityManager->getRepository(Offer::class)->findOneBy(['name' => $data['name']]);
        // if ($existingOffer) {
        //     return $this->json([
        //         'status' => "Forbidden",
        //         'code' => 403,
        //         'message' => "Offer already exists."
        //     ], 403);
        // }

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
        if (!empty($data['photos_offer'])) {
            foreach ($data['photos_offer'] as $filename) {
                $image = new Image();
                $image->setImageFile($filename);
                $offer->addImage($image); // ajoute automatiquement l'image à l'offre
            }
        }
        // $offer->setCreatedAt(new \DateTimeImmutable());
        $offer->setUpdatedAt(new DateTimeImmutable());
        $offer->setSeller($this->getUser()); // Assurez-vous que l'utilisateur est connecté


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

    #[Route('/search', methods: ['POST'])]
    public function search(Request $request, OfferRepository $offerRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $keyword = $data['keyword'] ?? null;

        if (!$keyword || empty(trim($keyword))) {
            return $this->json([
                'status' => "Bad Request",
                'code' => 400,
                'value' => $keyword,
                'message' => "Missing or empty 'keyword' parameter."
            ], 400);
        }

        $offers = $offerRepository->searchByName($keyword);

        if (empty($offers)) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "No offers found."
            ], 404);
        }

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => $offers,
        ], 200, [], [
            'groups' => 'public',
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object) {
                return $object->getId();
            }
        ]);
    }
}
