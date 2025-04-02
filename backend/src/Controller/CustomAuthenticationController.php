<?php
namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CustomAuthenticationController extends AbstractController
{
    private $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    #[Route('/api/login', name: 'api_login', methods: ["POST"])]
    public function login(): Response
    {
        // Cette méthode est exécutée après un login réussi
        $user = $this->getUser(); // Récupère l'utilisateur authentifié
        $jwt = $this->jwtManager->create($user); // Crée un token JWT pour cet utilisateur

        // Créer un cookie contenant le token JWT
        $cookie = new Cookie('JWT', $jwt, time() + 3600, secure: true, httpOnly: true);

        // Créer la réponse avec le cookie
        $response = new Response();
        $response->headers->setCookie($cookie);
        $response->setContent(json_encode(['message' => 'Login success']));

        return $response;
    }
}
