<?php

namespace App\DataFixtures;

use App\Entity\Chat;
use App\Entity\Image;
use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ChatFixture extends Fixture implements DependentFixtureInterface
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
            'images' => ['crepe', 'crepe2'],
        ],
        [
            'client' => 'emma.legrand@example.com',
            'seller' => 'paul.moreau@example.com',
            'images' => ['crepe', 'crepe3'],
        ],
        [
            'client' => 'julie.robert@example.com',
            'seller' => 'admin2@example.com',
            'images' => ['curry'],
        ],
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (self::CHATS as $index => $data) {
            $chat = new Chat();

            $client = $this->getReference($data['client'],  User::class);
            
            $seller = $this->getReference($data['seller'],  User::class);

            $chat->setClient($client);
            $chat->setSeller($seller);

            foreach ($data['images'] as $imageRef) {
                $image = $this->getReference($imageRef, Image::class);
                $chat->addImage($image);
            }

            $manager->persist($chat);
            $this->addReference('chat_' . $index, $chat);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            ImageFixtures::class,
        ];
    }
}
