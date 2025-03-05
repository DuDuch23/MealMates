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
                'statusCode' => 400,
                'message' => "400 Bad Request : Missing 'id' parameter."
            ], 400);
        }
        $user = $entityManager->getRepository(User::class)->find($data['id']);
        if (!$user) 
        {
            return new JsonResponse([
                'status' => "Not Found",
                'statusCode' => 404,
                'message' => "404 Not Found : User doesn't exist "
            ], 404);
        }
        return new JsonResponse([
            'status' => "OK",
            'statusCode' => 200,
            'message' => "200 OK",
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
        if (!(isset($data['email']) && isset($data['name']) && isset($data['surname'])&& isset($data['password'])))
        {
            return new JsonResponse([
                'status' => "Bad Request",
                'statusCode' => 400,
                'message' => "400 Bad Request : Missing parameters."
            ], 400);
        }
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse([
                'status' => "Forbidden",
                'statusCode' => 403,
                'message' => "403 Forbidden : Email already exists"
            ], 403);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($this->hasher->hashPassword($user,$data['password']));
        $user->setName($data['name']);
        $user->setSurname($data['surname']);

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([
            'status' => "Created",
            'statusCode' => 201,
            'message' => "201 Created"
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
                'statusCode' => 400,
                'message' => "400 Bad Request : Missing 'id' parameter."
            ], 400);
        }
        $user = $entityManager->getRepository(User::class)->find($data['id']);
        if (!$user) 
        {
            return new JsonResponse([
                'status' => "Not Found",
                'statusCode' => 404,
                'message' => "404 Not Found : User doesn't exist "
            ], 404);
        }
        if ($data['id'] != $this->getUser()->getId() && !in_array("ROLE_ADMIN",$this->getUser()->getRoles())) 
        {
            return new JsonResponse([
                'status' => "Unauthorized",
                'statusCode' => 401,
                'message' => "401 Unauthorized : You are not abilitated to perform this action"
            ], 401);
        }
        if (isset($data['email'])) {
            $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if ($existingUser) 
            {
                return new JsonResponse([
                    'status' => "Forbidden",
                    'statusCode' => 403,
                    'message' => "403 Forbidden : Email already exists"
                ], 403);
            }
        }

        if (isset($data['email'])) $user->setEmail($data['email']);
        if (isset($data['password'])) $user->setPassword($data['password']);
        if (isset($data['name'])) $user->setName($data['name']);
        if (isset($data['surname'])) $user->setSurname($data['surname']);

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([
            'status' => "OK",
            'statusCode' => 200,
            'message' => "200 OK"
        ], 200);
    }

    #[Route('/delete', methods: ['DELETE'])]
    public function delete(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['id'])) {
            return new JsonResponse([
                'status' => "Bad Request",
                'statusCode' => 400,
                'message' => "400 Bad Request : Missing 'id' parameter"
            ], 400);
        }
        $user = $entityManager->getRepository(User::class)->find($data['id']);
        if (!$user) {
            return new JsonResponse([
                'status' => "Not Found",
                'statusCode' => 404,
                'message' => "404 Not Found : User doesn't exist"
            ], 404);
        }
        if ($data['id'] != $this->getUser()->getId() && !in_array("ROLE_ADMIN",$this->getUser()->getRoles())) 
        {
            return new JsonResponse([
                'status' => "Unauthorized",
                'statusCode' => 401,
                'message' => "401 Unauthorized : You are not abilitated to perform this action"
            ], 401);
        }
        
        $entityManager->remove($user);
        $entityManager->flush();
        return new JsonResponse([
            'status' => "OK",
            'statusCode' => 200,
            'message' => "200 OK"
        ], 200);
    }
}
