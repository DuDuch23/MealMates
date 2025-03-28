<?php
namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/user', name: 'api_user')]
class ApiUserController extends AbstractController
{
    private $hasher;
    private $regex = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";
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
        return new JsonResponse([
            'status' => "OK",
            'code' => 200,
            'data' => [
                'email' => $user->getEmail(),
                'name' => $user->getName(),
                'surname' => $user->getSurname()
            ]
        ], 200);
    }


    #[Route('/new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SerializerInterface $serializer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!(isset($data['email']) && isset($data['name']) && isset($data['surname'])&& isset($data['password']) && isset($data['password_confirm'])))
        {
            return new JsonResponse([
                'status' => "Bad Request",
                'code' => 400,
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
        $user->setName($data['name']);
        $user->setSurname($data['surname']);
        $user->setRoles(isset($data['role']) ? [$data['role']] : ["ROLE_USER"]);

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
        if ($data['id'] != $this->getUser()->getId() && !in_array("ROLE_ADMIN",$this->getUser()->getRoles())) 
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
        if (isset($data['password'])) $user->setPassword($this->hasher->hashPassword($user,$data['password']));
        if (isset($data['name'])) $user->setName($data['name']);
        if (isset($data['surname'])) $user->setSurname($data['surname']);
        if (isset($data['role'])) $user->setRoles([$data['role']]);

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
        if ($data['id'] != $this->getUser()->getId() && !in_array("ROLE_ADMIN",$this->getUser()->getRoles())) 
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
