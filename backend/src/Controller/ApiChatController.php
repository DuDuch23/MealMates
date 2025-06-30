<?php
namespace App\Controller;

use DateTimeImmutable;
use App\Entity\Chat;
use App\Entity\User;
use App\Entity\Offer;
use App\Entity\Message;
use App\Service\ErrorService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Trait\MailerTrait;

#[Route('/api/chat', name: 'api_category')]
class ApiChatController extends AbstractController
{
    use MailerTrait;

    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    #[Route('/create', methods: ['POST'])]
    public function createOffer(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $error = new ErrorService();

        // Validation des champs requis
        if (!isset($data['client'])) {
            return new JsonResponse(['status' => "Bad Request", 'code' => 400, 'message' => "Missing 'client' parameter."], 400);
        }
        if (!isset($data['offer'])) {
            return new JsonResponse(['status' => "Bad Request", 'code' => 400, 'message' => "Missing 'offer' parameter."], 400);
        }
        if (!isset($data['seller'])) {
            return new JsonResponse(['status' => "Bad Request", 'code' => 400, 'message' => "Missing 'seller' parameter."], 400);
        }

        // Récupération des entités
        $client = $entityManager->getRepository(User::class)->find($data['client']);
        $seller = $entityManager->getRepository(User::class)->find($data['seller']);
        $offer = $entityManager->getRepository(Offer::class)->find($data['offer']);

        // Vérification de l'existence
        if (!$client) {
            $error->addError(['status' => "Bad Request", 'code' => 400, 'message' => "Le compte client n'existe pas."]);
        }
        if (!$seller) {
            $error->addError(['status' => "Bad Request", 'code' => 400, 'message' => "Le vendeur n'existe pas."]);
        }
        if (!$offer) {
            $error->addError(['status' => "Bad Request", 'code' => 400, 'message' => "L'offre n'existe pas."]);
        }
        if ($error->hasErrors()) {
            return new JsonResponse(['status' => "Bad Request", 'code' => 400, 'errors' => $error->getErrors()], 400);
        }

        // Vérification si un chat existe déjà
        $existingChat = $entityManager->getRepository(Chat::class)->findOneBy([
            'client' => $client,
            'seller' => $seller,
            'offer'  => $offer
        ]);

        if ($existingChat) {
            return new JsonResponse([
                'status' => 'Conflict',
                'code' => 409,
                'message' => 'Une conversation existe déjà.',
                'chatId' => $existingChat->getId()
            ], 409);
        }

        // Création du chat
        $chat = new Chat();
        $chat->setClient($client);
        $chat->setSeller($seller);
        $chat->setOffer($offer);

        $entityManager->persist($chat);
        $entityManager->flush();

        // envoie du mail vers le vendeur
        $this->sendMail(
            'mealmates.g5@gmail.com',
            $data['email'],
            'Confirmation de la réservation de l\'offre',
            '',
            'emails/createConversationSeller.html.twig',
            [
                "offer" => $offer,
                "client" => $client,
                "seller" => $seller,
            ],
            $this->mailer,
        );

        // envoie du mail vers le client
        $this->sendMail(
            'mealmates.g5@gmail.com',
            $data['email'],
            'Confirmation de la réservation de l\'offre',
            '',
            'emails/createConversationClient.html.twig',
            [
                "offer" => $offer,
                "client" => $client,
                "seller" => $seller,
            ],
            $this->mailer,
        );


        return $this->json([
            'status' => "Created",
            'code' => 201,
            'chatId' => $chat->getId()
        ], 201);
    }

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
                    'id' => $otherUser->getId(),
                ],
            ];
        }

        return $this->json(['data' => $res], 200, [], ['groups' => ['public']]);
    }

    // message
    #[Route('/get', methods: ['POST'])]
    public function getToChat(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id'])) {
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'id' parameter."
            ], 400);
        }

        if (!isset($data['chat'])) {
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'chat' parameter."
            ], 400);
        }

        $userId = (int) $data['id'];
        $chatId = (int) $data['chat'];
        $results = $entityManager->getRepository(Chat::class)->find($chatId);

        if ($results->getClient()->getId() !== $userId && $results->getSeller()->getId() !== $userId) 
        {
            return new JsonResponse([
                'status' => "Forbidden",
                'code' => 403,
                'message' => "Vous ne pouvez pas accéder à cette conversation"
            ], 403);
        }

        $res = [];
        $res[] = ["chat_id" => $results->getId()];

        foreach ($results->getMessages() as $message) {
            $sender = $message->getSender();

            $res[] = [
                'message' => [
                    'idForMessage' => $message->getId(),
                    'content' => $message->getContent(),
                ],
                'user' => [
                    'name' => $sender->getFirstName(),
                    'icon' => $sender->getIconUser(),
                    'id' => $sender->getId(),
                ]
            ];
        }

        return $this->json(['data' => $res], 200, [], ['groups' => ['public']]);
    }

    #[Route('/get/{id}', methods:  ['POST'])]
    public function getInfoForChat(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(),true);

        if(!isset($data['id'])){
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'id' parameter."
            ], 400);
        }

        $chatId = (int)$data['chat'];

        $results = $entityManager->getRepository(Chat::class)->find($chatId);

        $client = $results->getClient();

        $seller = $results->getSeller();

        $res = [
            "client" => [
                "id" => $client->getId(),
            ],
            "seller" => [
                "id" => $seller->getId(),
            ]
        ];

        return $this->json(['data' => $res], 200, [], ['groups' => ['public']]);
    }

    #[Route('/send/message', methods:['POST'])]
    public function sendMessage(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $date = new \DateTime();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['chat'], $data['user'], $data['content'])) {
            return new JsonResponse([
                'status' => 'Bad Request',
                'message' => 'chat_id, user_id et content sont requis.',
            ], 400);
        }

        $chat = $entityManager->getRepository(Chat::class)->find($data['chat']);
        $user = $entityManager->getRepository(User::class)->find($data['user']);

        if (!$chat ||!$user) {
            return new JsonResponse([
                'status' => 'Not Found',
                'message' => 'Chat ou User introuvable.',
                'data' => $chat,
            ], 404);
        }

        if($chat->getClient() !=$user && $chat->getSeller() != $user){
            return new JsonResponse([
                'status' => 'Not Found',
                'message' => 'Chat ou User introuvable.',
                'chat' =>  $entityManager->getRepository(Chat::class)->find($data['chat']),
                'data' => $chat,
            ], 404);
        }

        $message = new Message();
        $message->setContent($data['content']);
        $message->setSender($user);
        $message->setChat($chat);
        $message->setSentAt($date);

        $entityManager->persist($message);
        $entityManager->flush();

        return $this->json(['status' => $chat->getClient(),'user'=>$chat->getSeller()], 200, [], ['groups' => ['public']]);
    }

    #[Route('/polling/data', methods:['POST'])]
    public function getPolling(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(),true);

        if(!isset($data['chat'])){
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'chat' parameter."
            ], 400);
        }

        if(!isset($data['lastMessage'])){
            $data['lastMessage'] = new \DateTime();
            $data['lastMessage'] = $data['lastMessage']->format('Y-m-d H:i:s');
        }


        $messages = $entityManager->getRepository(Message::class)->findWithPolling($data['chat'], $data['lastMessage']);

        // Récupérer l'autre utilisateur en base
        foreach($messages as $message){
            $res [] = [
                'id' => $message->getId(),
                'sendAt' => $message->getSentAt(),
                'user' => [
                    'idForMessage' => $message->getSender()->getId(),
                    'nameUser' => $message->getSender()->getFirstName(),
                    'iconUser' => $message->getSender()->getIconUser(),
                ],
                'content' => [
                    'message'=> $message->getContent(),
                ],
            ];
        }

       return $this->json(['messages' => $messages], 200, [], ['groups' => ['public']]);
    }

}