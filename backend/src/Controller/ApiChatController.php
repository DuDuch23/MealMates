<?php
namespace App\Controller;

use App\Entity\Chat;
use App\Entity\User;
use App\Entity\Message;
use Symfony\Component\Mercure\Update;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mercure\HubInterface;
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

        $userId = $data['id'];
        $chats = $entityManager->getRepository(Chat::class)->findBySellerAndClient($userId);

        $res = [];

        foreach ($chats as $chat) {
            $otherUser = null;

            if ($chat->getClient()->getId() !== $userId) {
                $otherUser = $chat->getClient();
            } elseif ($chat->getSeller()->getId() !== $userId) {
                $otherUser = $chat->getSeller();
            }

            // Récupération du dernier message
            $lastMessage = $entityManager->getRepository(Message::class)->getLastChat($chat->getId(), $userId);

            $res[] = [
                'chat_id' => $chat->getId(),
                'user' => $otherUser,
                'last_message' => $lastMessage
            ];
        }

        return $this->json(['data' => $res], 200, [], ['groups' => ['public']]);

    }

    #[Route('/get/chat', methods: ['POST'])]
    public function getToChat(Request $request, HubInterface $hub, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(),true);

        if(!isset($data['client'])){
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'client' parameter."
            ], 400);
        }

        if(!isset($data['seller'])){
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'seller' parameter."
            ], 400);
        }

        $chat = $entityManager->getRepository(Chat::class)->findBySellerAndClient($data['client'],$data['seller']);

        $update = new Update(
            'https://chat.example.com/messages',
            json_encode(['chat' => $chat, 'message' => 'Bonjour !'])
        );

        $hub->publish($update);

        return new JsonResponse(['status' => 'Chat connected']);
    }

    #[Route('/sendChat', methods:['POST'])]
    public function sendMessage(Request $request, HubInterface $hub, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['chat_id'], $data['user_id'], $data['content'])) {
            return new JsonResponse([
                'status' => 'Bad Request',
                'message' => 'chat_id, user_id et content sont requis.'
            ], 400);
        }

        $chat = $entityManager->getRepository(Chat::class)->find($data['chat_id']);
        $user = $entityManager->getRepository(User::class)->find($data['user_id']);

        if (!$chat || !$user) {
            return new JsonResponse([
                'status' => 'Not Found',
                'message' => 'Chat ou User introuvable.'
            ], 404);
        }

        $message = new Message();
        $message->setContent($data['content']);
        $message->setSender($user);
        $message->setChat($chat);

        $entityManager->persist($message);
        $entityManager->flush();

        $topic = 'https://groupe-5.lycee-stvincent.net/chat/' . $chat->getId();

        $update = new Update(
            $topic,
            json_encode([
                'message' => [
                    'content' => $message->getContent(),
                    'sender' => $user->getId(),
                    'chat_id' => $chat->getId(),
                ]
            ])
        );

        $hub->publish($update);

        return new JsonResponse(['status' => 'Message envoyé'], 201);
    }

}