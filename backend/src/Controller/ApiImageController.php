<?php
namespace App\Controller;

use App\Repository\ImageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ApiImageController extends AbstractController
{
    #[Route('/api/images', name: 'api_images', methods: ['POST'])]
    public function list(ImageRepository $imageRepository): JsonResponse
    {
        $images = $imageRepository->findAll();
        $res = [];

        foreach($images as $element){
            array_push($res,$element->getImageFile());
        }

        return $this->json($res);
    }

}
