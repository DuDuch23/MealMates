<?php
namespace App\Controller;

use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/category', name: 'api_category')]
class ApiCategoryController extends AbstractController
{
    #[Route('/', methods: ['GET'])]
    public function index(EntityManagerInterface $entityManager, SerializerInterface $serializer, Request $request): JsonResponse
    {
        $categories = $entityManager->getRepository(Category::class)->findAll();

        if (empty($categories)) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "No categories found."
            ], 404);
        }

        $categoriesSerialized = $serializer->serialize($categories, 'json', ['groups' => 'public']);

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => json_decode($serializer->serialize($categories, 'json', ['groups' => 'public']), true),
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

        $category = $entityManager->getRepository(Category::class)->find($data['id']);
        if (!$category) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "Category doesn't exist."
            ], 404);
        }

        return $this->json([
            'status' => "OK",
            'code' => 200,
            'data' => json_decode($serializer->serialize($category, 'json', ['groups' => 'public']), true),
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

        $existingCategory = $entityManager->getRepository(Category::class)->findOneBy(['name' => $data['name']]);
        if ($existingCategory) {
            return $this->json([
                'status' => "Forbidden",
                'code' => 403,
                'message' => "Category already exists."
            ], 403);
        }

        $category = new Category();
        $category->setName($data['name']);

        $entityManager->persist($category);
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

        $category = $entityManager->getRepository(Category::class)->find($data['id']);
        if (!$category) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "Category doesn't exist."
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

        $category->setName($data['name']);

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

        $category = $entityManager->getRepository(Category::class)->find($data['id']);
        if (!$category) {
            return $this->json([
                'status' => "Not Found",
                'code' => 404,
                'message' => "Category doesn't exist."
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

        $entityManager->remove($category);
        $entityManager->flush();

        return $this->json([
            'status' => "OK",
            'code' => 200,
        ], 200);
    }
}
