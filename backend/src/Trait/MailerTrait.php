<?php

namespace App\Trait;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

trait MailerTrait
{
    public function sendMail( string $sender, string $recipient, string $subject, string $message, string $htmlTemplate,array $context = [], MailerInterface $mailer): void {
        $email = (new TemplatedEmail())
            ->from($sender)
            ->to($recipient)
            ->subject($subject)
            ->text($message)
            ->htmlTemplate($htmlTemplate)
            ->context($context);
        $mailer->send($email);
    }
}
