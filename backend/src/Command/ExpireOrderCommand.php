<?php

namespace App\Command;

use App\Entity\Order;
use App\Repository\OrderRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Scheduler\Attribute\AsCronTask;

#[AsCommand(
    name: 'app:expire-order',
    description: 'Expire orders that are past their expiration date.'
)]

#[AsCronTask('0 0 * * *')] // Toutes les minutes
class ExpireOrderCommand extends Command
{
    private OrderRepository $orderRepository;

    public function __construct(OrderRepository $orderRepository)
    {
        parent::__construct();
        $this->orderRepository = $orderRepository;
    }

    protected function configure(): void
    {
        $this->setName('app:expire-order')
            ->setDescription('Expires orders that are past their expiration date.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $expiredOrders = $this->orderRepository->findExpiredOrders();

        foreach ($expiredOrders as $order) {
            $order->setIsConfirmed(false);
            $this->orderRepository->save($order);
            $output->writeln(sprintf('Order %d has been expired.', $order->getId()));
        }

        return Command::SUCCESS;
    }
}