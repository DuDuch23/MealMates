<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use App\Entity\Rating;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class RatingFixtures extends Fixture implements DependentFixtureInterface
{
    public const RATINGS = [
        [
            "rater" => "email@example.com",
            "rated" => "admin@example.com",
            "score" => 5,
            "comment" => "Great user!"
        ],
        [
            "rater" => "admin@example.com",
            "rated" => "email@example.com",
            "score" => 4,
            "comment" => "Good communication"
        ]
    ];

    public function load(ObjectManager $manager): void
    {
        foreach ($this::RATINGS as $rating) {

            $obj = new Rating();
            $obj->setRater($this->getReference($rating["rater"], User::class));
            $obj->setRated($this->getReference($rating["rated"], User::class));
            $obj->setScore($rating["score"]);
            $obj->setComment($rating["comment"]);

            $manager->persist($obj);
        }

        $manager->flush();
    }

    // Ensures UserFixtures runs first
    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
