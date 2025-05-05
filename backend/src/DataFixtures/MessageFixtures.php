<?php

namespace App\DataFixtures;

use App\Entity\Message;
use App\Entity\Chat;
use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Faker\Factory;

class MessageFixtures extends Fixture
{
    // Faker pour générer des données aléatoires
    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create();
    }

    public function load(ObjectManager $manager): void
    {
        // Récupération des références des chats existants
        $chats = $manager->getRepository(Chat::class)->findAll();
        $users = $manager->getRepository(User::class)->findAll();

        foreach ($chats as $chat) {
            $numMessages = rand(2, 5);

            for ($i = 0; $i < $numMessages; $i++) {
                $message = new Message();
                
                // Sélectionner un utilisateur aléatoire parmi ceux déjà persistés
                $sender = $this->faker->randomElement($users);

                // Créer un message
                $message->setChat($chat);
                $message->setSender($sender);
                $message->setContent($this->faker->paragraph());
                $message->setSentAt($this->faker->dateTimeThisYear()); 

                $manager->persist($message);
            }
        }

        $manager->flush();
    }
}
