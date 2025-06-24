<?php
namespace App\Controller;

use App\Repository\ImageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ApiImageController extends AbstractController
{
    #[Route('/api/images', name: 'api_images', methods: ['GET'])]
    public function list(ImageRepository $imageRepository): JsonResponse
    {
        $images = $imageRepository->findAll();

        $res = [];
        foreach ($images as $element) {
            $res[] = [
                'id' => $element->getId(),
                'url' => $element->getUrl()
            ];
        }

        return $this->json($res);
    }
}
