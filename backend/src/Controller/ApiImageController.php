<?php
namespace App\Controller\Api;

use App\Repository\ImageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ImageController extends AbstractController
{
    #[Route('/api/images', name: 'api_images', methods: ['GET'])]
    public function list(ImageRepository $imageRepository): JsonResponse
    {
        $images = $imageRepository->findAll();

        $data = array_map(fn($image) => [
            'id' => $image->getId(),
            'name' => $image->getName(),
            'url' => '/uploads/images/' . $image->getLink(), // Vich stocke par défaut dans /public/uploads/images
        ], $images);

        return $this->json($data);
    }
}
