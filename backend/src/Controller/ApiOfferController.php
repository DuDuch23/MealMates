<?php

namespace App\Controller;

use App\Entity\Offer;
use App\Entity\Category;
use App\Repository\OfferRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use ApiPlatform\Metadata\UrlGeneratorInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/offers')]
#[IsGranted('ROLE_USER')]
class ApiOfferController extends AbstractController
{
    #[Route('', name: 'api_offers_index', methods: ['GET'])]
    public function index(OfferRepository $offerRepository, SerializerInterface $serializer, Request $request): JsonResponse
    {
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 5);

        $offers = $offerRepository->findAllWithPagination($page, $limit);

        $json = $serializer->serialize($offers, 'json', ['groups' => 'offer:read']);

        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'api_offers_show', methods: ['GET'])]
    public function show(Offer $offer, SerializerInterface $serializer): JsonResponse
    {
        $json = $serializer->serialize($offer, 'json', ['groups' => 'offer:read']);

        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }

    #[Route('/new', name: 'api_offer_new', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function new(Request $request, EntityManagerInterface $em, SerializerInterface $serializer, CategoryRepository $categoryRepository, UrlGeneratorInterface $urlGenerator): JsonResponse
    {
        $offer = $serializer->deserialize($request->getContent(), Offer::class, 'json');
        $em->persist($offer);
        $em->flush();

        // Gestion des catégories (ajout d'une ou plusieurs catégories)
        $categoryIds = $request->request->get('category_ids');
        if (is_array($categoryIds)) {
            foreach ($categoryIds as $categoryId) {
                $category = $categoryRepository->find($categoryId);
                if ($category) {
                    $offer->addCategory($category);
                }
            }
            $em->persist($offer);
            $em->flush();
        }

        $location = $urlGenerator->generate(
            'api_offer_show', // La route de l'offre
            ['id' => $offer->getId()],
            UrlGeneratorInterface::ABS_URL
        );

        return $this->json($offer, Response::HTTP_CREATED, ["Location" => $location], ['groups' => 'getOffer']);
    }

    #[Route('/{id}', name: 'api_offer_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request, Offer $currentOffer, EntityManagerInterface $em, SerializerInterface $serializer, UrlGeneratorInterface $urlGenerator): JsonResponse
    {
        $updatedOffer = $serializer->deserialize($request->getContent(), Offer::class, 'json', [AbstractNormalizer::OBJECT_TO_POPULATE => $currentOffer]);

        $categoryIds = $request->request->get('category_ids');
        if (is_array($categoryIds)) {
            foreach ($categoryIds as $categoryId) {
                $category = $em->getRepository(Category::class)->find($categoryId);
                if ($category) {
                    $updatedOffer->addCategory($category);
                }
            }
        }

        $em->persist($updatedOffer);
        $em->flush();

        $location = $urlGenerator->generate(
            'api_offer_show',
            ['id' => $updatedOffer->getId()],
            UrlGeneratorInterface::ABS_URL
        );

        return $this->json(['status' => 'success'], Response::HTTP_OK, ["Location" => $location]);
    }

    #[Route('/{id}', name: 'api_offer_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(Offer $offer, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($offer);
        $em->flush();

        return $this->json(['status' => 'Offer deleted successfully', 'offer' => $offer->getTitle()], Response::HTTP_OK);
    }
}