<?php
namespace App\Controller;

use App\Entity\Chat;
use App\Entity\User;
use App\Entity\Message;
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

        if (!isset($data['id'])) {
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'id' parameter."
            ], 400);
        }

        $chats = $entityManager->getRepository(Chat::class)->findBySellerAndClient($data["id"]);
        $res = [];
        foreach($chats as $chat){
            array_push($res,$chat["id"]);
            if($chat["client"]->getId()!=$data["id"]){
                array_push($res,$chat["client"]);
            }
            if($chat["seller"]["id"]!=$data["id"]){
                array_push($res,$chat["seller"]);
            }
        }
        // $messages = $entityManager->getRepository(Message::class)->getLasChat($chats["id"],);

        return $this->json(['data' => $res], 200, [], ['groups' => ['public']]);
    }
}