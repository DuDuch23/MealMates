<?php

namespace App\Controller;

use Endroid\QrCode\Builder\Builder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiQrCodeController  extends AbstractController {

    #[Route('/api/qr-code', name: 'api_qr_code')]
    public function qrCode(Request $request): Response
    {
        $url = $request->query->get('url');
        if (!$url) {
            return new Response('URL manquante', 400);
        }

        $result = Builder::create()
            ->data($url)
            ->size(300)
            ->build();

        return new Response($result->getString(), 200, [
            'Content-Type' => $result->getMimeType(),
        ]);
    }
}