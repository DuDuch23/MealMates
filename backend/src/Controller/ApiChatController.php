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

        $userId = (int) $data['id'];
        $results = $entityManager->getRepository(Chat::class)->findBySellerAndClient($userId);

        $res = [];

        foreach ($results as $row) {
            // $row est un tableau avec : content, idChat, sentAt, otherUserId

            // Récupérer l'autre utilisateur en base
            $otherUser = $entityManager->getRepository(User::class)->find($row['otherUserId']);

            $res[] = [
                'chat_id' => $row['idChat'],
                'last_message' => [
                    'content' => $row['content'],
                    'sentAt' => $row['sentAt'],
                ],
                'user' => [
                    'name' => $otherUser->getFirstName(),
                    'icon' => $otherUser->getIconUser(),
                ],
            ];
        }

        return $this->json(['data' => $res], 200, [], ['groups' => ['public']]);
    }

    #[Route('/get', methods: ['POST'])]
    public function getToChat(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(),true);

        if(!isset($data['id'])){
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'chat' parameter."
            ], 400);
        }

        $messages = $entityManager->getRepository(Message::class)->findByChat($data['id']);

        // Récupérer l'autre utilisateur en base
        foreach($messages as $message){
            $res [] = [
                'user' => [
                    'nameUser' => $message->getSender()->getFirstName(),
                    'iconUser' => $message->getSender()->getIconUser(),
                ],
                'content' => [
                    'message'=> $message->getContent(),
                ],
            ];
        }

       return $this->json(['messages' => $res], 200, [], ['groups' => ['public']]);
    }

    #[Route('/sendChat', methods:['POST'])]
    public function sendMessage(Request $request, EntityManagerInterface $entityManager): JsonResponse
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

        return new JsonResponse(['status' => 'Message envoyé'], 201);
    }

}