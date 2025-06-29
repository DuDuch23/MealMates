<?php
namespace App\Command;

use App\Entity\Chat;
use App\Entity\Order;
use App\Repository\OfferRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Scheduler\Attribute\AsCronTask;

#[AsCommand(
    name: 'app:expire-offer',
    description: 'Expire et supprime les offres qui sont expirées.'
)]
#[AsCronTask('* * * * *')]
class ExpireOfferCommand extends Command
{
    public function __construct(
        private readonly OfferRepository $offerRepository,
        private readonly EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $expiredOffers = $this->offerRepository->findExpiredOffers();


        foreach ($expiredOffers as $offer) {
            $orders = $this->entityManager->getRepository(Order::class)->findBy(['offer' => $offer]);
            $chats = $this->entityManager->getRepository(Chat::class)->findBy(['offer' => $offer]);
            foreach ($orders as $order) {
                $this->entityManager->remove($order);
            }

            foreach ($chats as $chat) {
                $this->entityManager->remove($chat);
            }
            
            $this->entityManager->remove($offer);
            $output->writeln(sprintf('L\'offre #%d et ses commandes associées ont bien été supprimées.', $offer->getId()));
        }
        $this->entityManager->flush();


        return Command::SUCCESS;
    }
}
