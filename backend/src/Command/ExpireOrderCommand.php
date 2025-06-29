<?php
namespace App\Command;

use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Scheduler\Attribute\AsCronTask;

#[AsCommand(
    name: 'app:expire-order',
    description: 'Expire et supprime les réservations non confirmées qui sont expirées.'
)]
#[AsCronTask('* * * * *')]
class ExpireOrderCommand extends Command
{
    public function __construct(
        private readonly OrderRepository $orderRepository,
        private readonly EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $expiredOrders = $this->orderRepository->findExpiredOrders();


        foreach ($expiredOrders as $order) {
            $this->entityManager->remove($order);
            $output->writeln(sprintf('La réservation a bien été supprimé.', $order->getId()));
        }

        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
