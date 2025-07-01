<?php

namespace App\Controller;

use App\Trait\MailerTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;

class TestController extends AbstractController
{
    use MailerTrait;

    #[Route('/test-email', name: 'test_email')]
    public function sendTestEmail(MailerInterface $mailer)
    {
        $this->sendMail(
            'mealmates.g5@gmail.com',
            'dimitrigranit22@gmail.com',
            'Test Email from Trait',
            'This is a plain text version.',
            'emails/signup.html.twig',
            [],
            $mailer
        );

        return $this->json(['message' => 'Email sent using trait!']);
    }
}
