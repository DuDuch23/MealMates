<?php

namespace App\DataFixtures;

use App\Entity\Chat;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class ChatFixture extends Fixture
{
    public const CHATS = [
        [
            'client' => 'user@example.com',
            'seller' => 'admin@example.com',
            'images' => ['chili', 'chili2'],
        ],
        [
            'client' => 'jean.dupont@example.com',
            'seller' => 'sophie.martin@example.com',
            'images' => ['crepe','crepe2'],
        ],
        [
            'client' => 'emma.legrand@example.com',
            'seller' => 'paul.moreau@example.com',
            'images' => ["crepe","crepe4"],
        ],
        [
            'client' => 'julie.robert@example.com',
            'seller' => 'admin2@example.com',
            'images' => ['curry'],
        ],
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (self::CHATS as $code => $attributes) {
            $chat = new Chat();

            $client = $this->getReference($attributes['client']);
            $seller = $this->getReference($attributes['seller']);

            $chat->setClient($client);
            $chat->setSeller($seller);

            // Ajouter des images ou d'autres données si nécessaire
            foreach ($attributes['images'] as $imageRef) {
                $image = $this->getReference($imageRef);
                $chat->addImage($image);
            }

            $manager->persist($chat);
            $this->addReference($code, $chat);
        }

        $manager->flush();
    }
}
