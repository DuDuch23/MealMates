<?php
namespace App\Controller;

use App\Entity\User;
use App\Enum\PreferenceEnum;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Google\Client as GoogleClient;


#[Route('/api/user', name: 'api_user')]
class ApiUserController extends AbstractController
{
    private $hasher;
    private $regex = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{8,}$/";
    
    public function __construct(UserPasswordHasherInterface $hasher) 
    {
        $this->hasher = $hasher;
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
        if (isset($data["role"]) && $data["role"]!= "ROLE_USER" && !in_array("ROLE_ADMIN",$this->getUser()->getRoles()))
        {
            return new JsonResponse([
                'status' => "Unauthorized",
                'code' => 401,
                'message' => "You are not abilitated to perform this action."
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
}