<?php
namespace App\Command;

use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Scheduler\Attribute\AsCronTask;

use App\Trait\MailerTrait;
use Symfony\Component\Mailer\MailerInterface;

#[AsCommand(
    name: 'app:notification-end-offer',
    description: 'Envoie un mail aux vendeurs dont la date de péremption arrive dans j-7.'
)]
#[AsCronTask('* * * * *')]
class NotificationOfferCommand extends Command
{
    use MailerTrait;

    private MailerInterface $mailer;

    public function __construct(
        MailerInterface $mailer,
        private readonly OrderRepository $orderRepository,
        private readonly EntityManagerInterface $entityManager
    ) {
        $this->mailer = $mailer;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $orders = $this->orderRepository->findExpiringOffersIn7Days();

        foreach ($orders as $order) {
            $user = $order->getSeller();

            $offerUrl = sprintf('http://localhost:5173/offer/%d', $order->getId());

            $this->sendMail(
                'mealmates.g5@gmail.com',
                $user->getEmail(),
                'Votre offre va bientôt expirer',
                '',
                'emails/notificationOfferExpiration.html.twig',
                [
                    'seller' => $user,
                    'offerUrl' => $offerUrl,
                ],
                $this->mailer
            );

            $this->entityManager->remove($order);
            $output->writeln('Le mail a bien été envoyée. ID: ' . $order->getId(). 'User '. $user->getId());
        }

        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
