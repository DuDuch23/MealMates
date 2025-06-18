<?php

namespace App\Trait;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

trait MailerTrait
{
    public function sendMail(
        string $sender,
        string $recipient,
        string $subject,
        string $message,
        string $html,
        MailerInterface $mailer
    ): void {
        $email = (new Email())
            ->from($sender)
            ->to($recipient)
            ->subject($subject)
            ->text($message)
            ->html($html);

        $mailer->send($email);
    }
}
