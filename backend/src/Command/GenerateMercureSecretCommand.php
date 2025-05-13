<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:mercure:generate-secret',
    description: 'Génère une clé secrète sécurisée pour Mercure.',
)]
class GenerateMercureSecretCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $bytes = random_bytes(32); // 256 bits
        $secret = base64_encode($bytes);

        $output->writeln('Voici ta nouvelle clé Mercure à mettre dans .env :');
        $output->writeln('');
        $output->writeln('MERCURE_JWT_SECRET=' . $secret);
        $output->writeln('');

        return Command::SUCCESS;
    }
}
