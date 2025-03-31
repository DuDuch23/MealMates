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
            "rater" => "user@example.com", // Utiliser une clé de référence valide
            "rated" => "admin@example.com",
            "score" => 5,
            "comment" => "Great user!"
        ],
        [
            "rater" => "admin@example.com", // Utiliser une clé de référence valide
            "rated" => "user@example.com",
            "score" => 4,
            "comment" => "Good communication"
        ]
    ];

    public function load(ObjectManager $manager): void
    {
        foreach (self::RATINGS as $ratingData) {
            // Référence valide pour récupérer les utilisateurs
            $rater = $this->getReference($ratingData["rater"], User::class);
            $rated = $this->getReference($ratingData["rated"], User::class);

            $rating = new Rating();
            $rating->setRater($rater);
            $rating->setRated($rated);
            $rating->setScore($ratingData["score"]);
            $rating->setComment($ratingData["comment"]);

            $manager->persist($rating);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class, 
        ];
    }
}
