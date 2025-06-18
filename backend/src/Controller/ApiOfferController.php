<?php
namespace App\Controller;

use App\Entity\User;
use App\Entity\Image;
use App\Entity\Offer;
use DateTimeImmutable;
use App\Service\SlugService;
use App\Repository\OfferRepository;
use App\Repository\OrderRepository;
use App\Repository\CategoryRepository;
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
        $offersLocation = $serializer->serialize($offers, 'json', ['groups' => 'map']);

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => json_decode($serializer->serialize($offers, 'json', ['groups' => 'public']), true),
        ], 200);
    }

    #[Route('/get/{id}', methods: ['GET'])]
    public function getOfferByID(int $id,
    OrderRepository $orderRepository,
    EntityManagerInterface $entityManager,
    SerializerInterface $serializer): JsonResponse
    {
        $offer = $entityManager->getRepository(Offer::class)->find($id);

        if (!$offer) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "No offer found."
            ], 404);
        }

        $activeOrder = $orderRepository->findActiveForOffer($offer);

        $data = json_decode($serializer->serialize($offer, 'json', ['groups' => 'public']), true);

        $data['order'] = $activeOrder ? [
            'id'          => $activeOrder->getId(),
            'isConfirmed' => $activeOrder->isConfirmed(),
            'expiresAt'   => $activeOrder->getExpiresAt()?->format('Y-m-d H:i:s'),
        ] : null;

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
    public function new(Request $request, EntityManagerInterface $entityManager, CategoryRepository $categoryRepository, SlugService $slugService): JsonResponse
    {
        if (!$this->getUser()) {
            return $this->json(['error' => 'Unauthorized'], 401);
        }
        
        $offer = new Offer();

        $offer->setProduct($request->request->get('product'));
        $slug = $slugService->generateUniqueSlug($request->request->get('product'));
        $offer->generateSlug($slug);
        $offer->setDescription($request->request->get('description'));
        $offer->setQuantity($request->request->get('quantity'));
        $offer->setExpirationDate(new \DateTime($request->request->get('expirationDate')));
        $offer->setPrice($request->request->get('price'));
        $offer->setIsDonation(filter_var($request->request->get('isDonation'), FILTER_VALIDATE_BOOLEAN));
        $offer->setPickupLocation($request->request->get('pickupLocation'));
        $offer->setIsRecurring(filter_var($request->request->get('isRecurring'), FILTER_VALIDATE_BOOLEAN));
        $offer->setLatitude($request->request->get('latitude'));
        $offer->setLongitude($request->request->get('longitude'));

        $availableSlots = json_decode($request->request->get('availableSlots'), true);
        $offer->setAvailableSlots($availableSlots ?? []);

        $categoryIds = $request->request->all('categories');
        foreach ($categoryIds as $id) {
            $category = $categoryRepository->find($id);
            if ($category) {
                $offer->addCategory($category);
            }
        }

        $files = $request->files->get('photos_offer');

        if ($files) {
            if (!is_array($files)) {
                $files = [$files];
            }

            foreach ($files as $file) {
                $image = new Image();
                $image->setImageFile($file);
                $offer->addImage($image);
            }
        }

        $offer->setUpdatedAt(new \DateTimeImmutable());
        $offer->setSeller($this->getUser());

        $entityManager->persist($offer);
        $entityManager->flush();

        return $this->json(['status' => "Created", 'code' => 201], 201);
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

    #[Route('/search/filters', name: 'api_offer_search_filters', methods: ['POST'])]
    public function searchByCriteria(Request $request, OfferRepository $offerRepository, SerializerInterface $serializer): JsonResponse
    {
        $criteria = json_decode($request->getContent(), true);

        $offers = $offerRepository->findByFilters($criteria);

        if (empty($offers)) {
            return $this->json([
                'status' => 'Not Found',
                'code' => 404,
                'message' => 'No offers match the given criteria.',
            ], 404);
        }

        return $this->json([
            'status' => 'OK',
            'code' => 200,
            'data' => json_decode($serializer->serialize($offers, 'json', ['groups' => 'public']), true),
        ], 200);
    }

}
