<?php
namespace App\Controller;

use App\Entity\Chat;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/chat', name: 'api_category')]
class ApiChatController extends AbstractController
{
    #[Route('/get/all', methods: ['POST'])]
    public function getAllChat(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id'])) 
        {
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'id' parameter."
            ], 400);
        }
        $chat = $entityManager->getRepository(Chat::class)->findAll($data['id']);
        return new JsonResponse(['data'=> $chat]);
        // if (!$chat) 
        // {
        //     return new JsonResponse([
        //         'status' => "Not Found",
        //         'code' => 404,
        //         'message' => "Chat doesn't exist "
        //     ], 404);
        // }
        // $scope = ($data['id'] != $chat->getId() && !in_array("ROLE_ADMIN",$this->getUser()->getRoles())) ? "public" : "private";
        // $data = json_decode($serializer->serialize($chat, 'json', ['groups' =>[ $scope]]), true);
        return new JsonResponse([
            'status' => "OK",
            'code' => 200,
            'data' => $data
        ], 200);
    }
}