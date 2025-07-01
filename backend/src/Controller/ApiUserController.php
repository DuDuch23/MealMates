<?php
namespace App\Controller;

use Google_Client;
use App\Entity\User;
use App\Enum\PreferenceEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Google\Client as GoogleClient;
use App\Trait\MailerTrait;
use Symfony\Component\Mailer\MailerInterface;


#[Route('/api/user', name: 'api_user')]
class ApiUserController extends AbstractController
{
    use MailerTrait;

    private $hasher;
    private $mailer;
    private $regex = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{8,}$/";
    
    public function __construct(UserPasswordHasherInterface $hasher, MailerInterface $mailer) 
    {
        $this->hasher = $hasher;
        $this->mailer = $mailer;
    }
    
    #[Route('/get', methods: ['POST'])]
    public function get(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager): JsonResponse
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
        $user = $entityManager->getRepository(User::class)->find($data['id']);
        if (!$user) 
        {
            return new JsonResponse([
                'status' => "Not Found",
                'code' => 404,
                'message' => "User doesn't exist "
            ], 404);
        }
        $scope = ($data['id'] != $user->getId() && !in_array("ROLE_ADMIN",$this->getUser()->getRoles())) ? "public" : "private";
        $data = json_decode($serializer->serialize($user, 'json', ['groups' =>[ $scope]]), true);
        return new JsonResponse([
            'status' => "OK",
            'code' => 200,
            'data' => $data
        ], 200);
    }

    #[Route('/ssoUser', methods:['POST'])]
    public function ssoUsers(    Request $request, JWTTokenManagerInterface $JWTManager, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $tokenFromGoogle = $data['token'] ?? null;

        if (!$tokenFromGoogle) {
            return new JsonResponse(['error' => 'No token provided'], 400);
        }

        $client = new Google_Client(['client_id' =>  $_ENV['CLIENT_ID_GOOGLE']]);

        $payload = $client->verifyIdToken($tokenFromGoogle);

        if (!$payload) {
            return new JsonResponse(['error' => 'Invalid Google token'], 401);
        }

        $email = $payload['email'];
        $firstName = $payload['given_name'] ?? '';

        // Recherche ou création utilisateur
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            $user = new User();
            $user->setEmail($email);
            $user->setFirstName($firstName);
            $user->setIsVerified(false);

            $randomPassword = bin2hex(random_bytes(16));
            $user->setPassword($passwordHasher->hashPassword($user, $randomPassword));

            $entityManager->persist($user);
            $entityManager->flush();
        }

        $token = $JWTManager->create($user);

        return new JsonResponse(['token' => $token]);
    }

    #[Route('/profile', methods: ['POST'])]
    public function profile(Request $request, EntityManagerInterface $entityManager, NormalizerInterface $normalizer): JsonResponse
    {
        // Récupérer les données JSON envoyées avec la requête POST
        $data = json_decode($request->getContent(), true);
    
        // Déterminer le scope en fonction de l'email
        $scope = isset($data["email"]) ? "public" : "private";
    
        // Chercher un utilisateur par email
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data["email"]]);
    
        // Vérifier si l'utilisateur existe
        if (!$user) {
            return new JsonResponse([
                'user'=>$user,
                'status' => "Unauthorized",
                'code' => 401,
                'message' => "User not authenticated",
            ], 401);
        }

        // Normaliser l'objet User pour le convertir en tableau
        $userData = $normalizer->normalize($user, null, [
            'attributes' => [
                'id', 'email', 'firstName', 'lastName', 'location', 'iconUser',
                'preferences' => ['id', 'name']
            ]
        ]);
    
        // Retourner une réponse avec les données utilisateur
        return new JsonResponse([
            'status' => "OK",
            'code' => 200,
            'user' => $userData,
            'scope' => $scope,
        ], 200);
    }

    #[Route('/new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!(isset($data['email']) && isset($data['firstName']) && isset($data['lastName'])&& isset($data['password']) && isset($data['password_confirm'])))
        {
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'data' => $data,
                'message' => "Missing parameters."
            ], 400);
        }
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) 
        {
            return new JsonResponse([
                'status' => "Forbidden",
                'code' => 403,
                'message' => "Email already exists"
            ], 403);
        }
        if (!preg_match($this->regex, $data["password"]))
        {
            return new JsonResponse([
                'status' => "Forbidden",
                'code' => 403,
                'message' => "Password must be 8+ characters, contain 1 lowercase, 1 uppercase, 1 digit, 1 special character."
            ], 403);
        }
        if ($data["password"] != $data["password_confirm"])
        {
            return new JsonResponse([
                'status' => "Forbidden",
                'code' => 403,
                'message' => "Password and password confirmation don't match"
            ], 403);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($this->hasher->hashPassword($user,$data['password']));
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setRoles($data['role'] ?? ["ROLE_USER"]);
        $user->setIsVerified(false);

        $entityManager->persist($user);
        $entityManager->flush();

        $this->sendMail(
            'mealmates.g5@gmail.com',
            $data['email'],
            'Confirmation d\'inscription mealmates',
            '',
            'emails/signup.html.twig',
            [],
            $this->mailer
        );

        return new JsonResponse([
            'status' => "Created",
            'code' => 201,
        ], 201);
    }

    #[Route('/edit', methods: ['PUT'])]
    public function edit(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
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
        $user = $entityManager->getRepository(User::class)->find($data['id']);
        if (!$user) 
        {
            return new JsonResponse([
                'status' => "Not Found",
                'code' => 404,
                'message' => "User doesn't exist "
            ], 404);
        }
        $currentUser = $this->getUser();
        if ($data['id'] != $user->getId() && !in_array("ROLE_ADMIN",$this->getUser()->getRoles()))
        {
            return new JsonResponse([
                'status' => "Unauthorized",
                'code' => 401,
                'message' => "You are not abilitated to perform this action"
            ], 401);
        }
        if (isset($data['email'])) {
            $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if ($existingUser) 
            {
                return new JsonResponse([
                    'status' => "Forbidden",
                    'code' => 403,
                    'message' => "Email already exists"
                ], 403);
            }
        }
        if (isset($data['password']) && !preg_match($this->regex, $data["password"]))
        {
            return new JsonResponse([
                'status' => "Forbidden",
                'code' => 403,
                'message' => "Password must be 8+ characters, contain 1 lowercase, 1 uppercase, 1 digit, 1 special character."
            ], 403);
        }
        if ((isset($data["password"]) || isset($data["password_confirm"])) && ($data["password"] != $data["password_confirm"]))
        {
            return new JsonResponse([
                'status' => "Forbidden",
                'code' => 403,
                'message' => "Password and password confirmation don't match"
            ], 403);
        }
        if (isset($data["role"]) && $data["role"]!= "ROLE_USER" && !in_array("ROLE_ADMIN",$this->getUser()->getRoles()))
        {
            return new JsonResponse([
                'status' => "Unauthorized",
                'code' => 401,
                'message' => "You are not abilitated to perform this action."
            ], 403);
        }

        if (isset($data['email'])) $user->setEmail($data['email']);
        if (isset ($data['idIcon'])) $user->setIconUser($data['idIcon']);
        if (isset($data['password'])) $user->setPassword($this->hasher->hashPassword($user,$data['password']));
        if (isset($data['firstName'])) $user->setFirstName($data['firstName']);
        if (isset($data['lastName'])) $user->setLastName($data['lastName']);
        if (isset($data['role'])) $user->setRoles([$data['role']]);
        if (isset($data['adress'])) $user->setAdress($data['adress']);
        if (isset($data['iconUser'])) $user->setIconUser($data['iconUser']);
        if (isset($data['preferences'])) $user->setPreferences(array_filter(array_map(fn($p) => PreferenceEnum::tryFrom($p), $data['preferences'] ?? [])));

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([
            'status' => "OK",
            'code' => 200,
        ], 200);
    }

    #[Route('/delete', methods: ['DELETE'])]
    public function delete(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id'])) {
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
                'message' => "Missing 'id' parameter"
            ], 400);
        }
        $user = $entityManager->getRepository(User::class)->find($data['id']);
        if (!$user) {
            return new JsonResponse([
                'status' => "Not Found",
                'code' => 404,
                'message' => "User doesn't exist"
            ], 404);
        }
        if ($data['id'] != $user->getId() && !in_array("ROLE_ADMIN",$this->getUser()->getRoles())) 
        {
            return new JsonResponse([
                'status' => "Unauthorized",
                'code' => 401,
                'message' => "You are not abilitated to perform this action"
            ], 401);
        }

        $entityManager->remove($user);
        $entityManager->flush();
        return new JsonResponse([
            'status' => "OK",
            'code' => 200,
        ], 200);
    }

    #[Route('/{id}/dashboard', name: '_dashboard', methods: ['GET'])]
    public function getUserDashboard(int $id, EntityManagerInterface $entityManagerInterface): JsonResponse
    {
        $user = $entityManagerInterface->getRepository(User::class)->find($id);
        if (!$user) return $this->json(['message' => 'User not found'], 404);

        $orders = $user->getOrders();
        $offers = $user->getOffers();

        $itemsBought = count($orders);
        $itemsSold = 0;
        $itemsDonated = 0;
        $moneySaved = 0;
        $moneyEarned = 0;
        $quantitySaved = 0;
        $transactionsByType = [
            'Ventes' => $itemsSold,
            'Dons' => $itemsDonated,
            'Achats' => $itemsBought,
        ];

        $byMonth = [];
        $byWeek = [];
        $byYear = [];

        foreach ($offers as $offer) {
            $date = $offer->getCreatedAt();
            $month = $date->format('Y-m');
            $week = $date->format('o-W');
            $year = $date->format('Y');

            foreach (['byMonth' => $month, 'byWeek' => $week, 'byYear' => $year] as $key => $timeKey) {
                ${$key}[$timeKey] ??= [
                    'month' => $month,
                    'week' => $week,
                    'year' => $year,
                    'kg' => 0,
                    'transactions' => 0,
                    'earned' => 0,
                    'saved' => 0,
                ];
                ${$key}[$timeKey]['kg'] += $offer->getQuantity();
                ${$key}[$timeKey]['transactions'] += 1;

                if (!$offer->getIsDonation()) {
                    ${$key}[$timeKey]['earned'] += $offer->getPrice() * $offer->getQuantity();
                }
            }
        }


        foreach ($orders as $order) {
            $offer = $order->getOffer();
            if (!$offer) continue;

            $date = $order->getPurchasedAt();
            $month = $date->format('Y-m');
            $week = $date->format('o-W');
            $year = $date->format('Y');

            foreach (['byMonth' => $month, 'byWeek' => $week, 'byYear' => $year] as $key => $timeKey) {
                ${$key}[$timeKey] ??= [
                    'month' => $month,
                    'week' => $week,
                    'year' => $year,
                    'kg' => 0,
                    'transactions' => 0,
                    'earned' => 0,
                    'saved' => 0,
                ];
                ${$key}[$timeKey]['transactions'] += 1;

                if (!$offer->getIsDonation()) {
                    ${$key}[$timeKey]['saved'] += $offer->getPrice() * $offer->getQuantity();
                    ${$key}[$timeKey]['kg'] += $offer->getQuantity();
                }
            }
        }

        $byMonth = array_values($byMonth);
        $byWeek = array_values($byWeek);
        $byYear = array_values($byYear);

        usort($byMonth, fn($a, $b) => strcmp($a['month'], $b['month']));
        usort($byWeek, fn($a, $b) => strcmp($a['week'], $b['week']));
        usort($byYear, fn($a, $b) => strcmp($a['year'], $b['year']));
        return $this->json([
            'transactionsCount' => $itemsBought + $itemsSold + $itemsDonated,
            'itemsBought' => $itemsBought,
            'itemsSold' => $itemsSold,
            'itemsDonated' => $itemsDonated,
            'moneySaved' => $moneySaved,
            'moneyEarned' => $moneyEarned,
            'quantitySaved' => $quantitySaved,
            'transactionsByType' => $transactionsByType,
            'byMonth' => $byMonth,
            'byYear' => $byYear,
            'byWeek' => $byWeek,
        ]);
    }
}