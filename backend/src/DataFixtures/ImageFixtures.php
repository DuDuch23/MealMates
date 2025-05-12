<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class ImageFixtures extends Fixture
{
    public const IMAGES = [
        [
            'name' => 'chili',
            'link' => 'chili.jpg',
        ],
        [
            'name' => 'chili2',
            'link' => 'chili2.jpg',
        ],
        [
            'name' => 'chili3',
            'link' => 'chili3.jpg',
        ],
        [
            'name' => 'confiture',
            'link' => 'confiture.jpg',
        ],
        [
            'name' => 'confiture2',
            'link' => 'confiture2.jpg',
        ],
        [
            'name' => 'confiture3',
            'link' => 'confiture3.jpg',
        ],
        [
            'name' => 'crepe',
            'link' => 'crepe.jpg',
        ],
        [
            'name' => 'crepe2',
            'link' => 'crepe2.jpg',
        ],
        [
            'name' => 'crepe3',
            'link' => 'crepe3.jpg',
        ],
        [
            'name' => 'croissants',
            'link' => 'croissants.jpg',
        ],
        [
            'name' => 'croissants2',
            'link' => 'croissants2.jpg',
        ],
        [
            'name' => 'croissants3',
            'link' => 'croissants3.jpg',
        ],
        [
            'name' => 'curry',
            'link' => 'curry.jpg',
        ],
        [
            'name' => 'curry2',
            'link' => 'curry2.jpg',
        ],
        [
            'name' => 'curry3',
            'link' => 'curry3.jpg',
        ],
        [
            'name' => 'fruits',
            'link' => 'fruits.jpg',
        ],
        [
            'name' => 'fruits2',
            'link' => 'fruits2.jpg',
        ],
        [
            'name' => 'fruits3',
            'link' => 'fruits3.jpg',
        ],
        [
            'name' => 'gallette',
            'link' => 'gallette.jpg',
        ],
        [
            'name' => 'gallette2',
            'link' => 'gallette2.jpg',
        ],
        [
            'name' => 'gallette3',
            'link' => 'gallette3.jpg',
        ],
        [
            'name' => 'gateaux',
            'link' => 'gateaux.jpg',
        ],
        [
            'name' => 'gateaux2',
            'link' => 'gateaux2.jpg',
        ],
        [
            'name' => 'gateaux3',
            'link' => 'gateaux3.jpg',
        ],
        [
            'name' => 'jus',
            'link' => 'jus.jpg',
        ],
        [
            'name' => 'jus2',
            'link' => 'jus2.jpg',
        ],
        [
            'name' => 'jus3',
            'link' => 'jus3.jpg',
        ],
        [
            'name' => 'jus4',
            'link' => 'jus4.jpg',
        ],
        [
            'name' => 'lasagnes',
            'link' => 'lasagnes.jpg',
        ],
        [
            'name' => 'lasagnes2',
            'link' => 'lasagnes2.jpg',
        ],
        [
            'name' => 'lasagnes3',
            'link' => 'lasagnes3.jpg',
        ],
        [
            'name' => 'legumes',
            'link' => 'legumes.jpg',
        ],
        [
            'name' => 'legumes2',
            'link' => 'legumes2.jpg',
        ],
        [
            'name' => 'legumes3',
            'link' => 'legumes3.jpg',
        ],
        [
            'name' => 'pain',
            'link' => 'pain.jpg',
        ],
        [
            'name' => 'pain2',
            'link' => 'pain2.jpg',
        ],
        [
            'name' => 'pain3',
            'link' => 'pain3.jpg',
        ],
        [
            'name' => 'pizza',
            'link' => 'pizza.jpg',
        ],
        [
            'name' => 'pizza2',
            'link' => 'pizza2.jpg',
        ],
        [
            'name' => 'pizza3',
            'link' => 'pizza3.jpg',
        ],
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (self::IMAGES as $code => $attributes) {
            $image = new Image();
            $image->setName($attributes['name']);
            $image->setLink($attributes['link']);
            $image->setUpdatedAt(new \DateTimeImmutable());
            
            $manager->persist($image);

            $this->addReference($attributes['name'], $image);
        }

        $manager->flush();
    }
}
