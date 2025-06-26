<?php

namespace App\DataFixtures;

use App\Entity\Order;
use App\Entity\Offer;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class OrderFixtures extends Fixture implements DependentFixtureInterface
{
    public const NB_ORDERS = 200;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        // on connaît le nombre d’offres/clients grâce aux constantes
        for ($i = 0; $i < self::NB_ORDERS; $i++) {

            /** @var Offer $offer */
            $offer = $this->getReference(
                OfferFixtures::OFFER_REF_PREFIX.$faker->numberBetween(0, OfferFixtures::NB_OFFERS - 1),
                Offer::class
            );

            /** @var User $buyer */
            $buyer = $this->getReference(
                $faker->randomElement([
                    'user@example.com',
                    'admin@example.com',
                    'jean.dupont@example.com',
                    'sophie.martin@example.com',
                    'paul.moreau@example.com',
                    'emma.legrand@example.com',
                    'admin2@example.com',
                    'julie.robert@example.com',
                    'mathieu.laurent@example.com',
                    'claire.fontaine@example.com',
                    'admin3@example.com',
                    'leo.duhamel@example.com',
                    'manon.guichard@example.com',
                    'tom.renard@example.com',
                    'marie.perrin@example.com',
                    'kevin.leclerc@example.com',
                ]),
                User::class
            );

            $order = new Order();
            $order
                ->setOffer($offer)
                ->setBuyer($buyer)
                ->setPurchasedAt(
                    \DateTimeImmutable::createFromMutable(
                        $faker->dateTimeBetween('-30 days', 'now')
                    )
                )
                ->setExpiresAt(
                    \DateTimeImmutable::createFromMutable(
                        $faker->dateTimeBetween('now', '+30 days')
                    )
                    );

            $manager->persist($order);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            OfferFixtures::class,
        ];
    }
}