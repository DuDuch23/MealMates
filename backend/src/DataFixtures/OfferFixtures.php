<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Offer;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;

use Symfony\Component\HttpKernel\KernelInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;


class OfferFixtures extends Fixture implements DependentFixtureInterface
{
    public $publicPath;
    public const OFFERS = [
        [
            'product' => 'Laptop',
            'description' => 'A powerful laptop for gaming and work.',
            'quantity' => 5,
            'expirationDate' => '2024-12-31',
            'price' => 5.99,
            'isDonation' => false,
            'photos_offer' => [
                'repas.jpg',
                'repas2.jpg',
                'repas3.jpg',
            ],
            'pickupLocation' => '123 Main St, Cityville',
            'availableSlots' => ['2024-01-01 10:00:00', '2024-01-02 14:00:00'],
            'isRecurring' => true,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Smartphone',
            'description' => 'Latest model smartphone with all features.',
            'quantity' => 10,
            'expirationDate' => '2024-11-30',
            'price' => 799.99,
            'isDonation' => false,
            'photos_offer' => [
                'repas.jpg',
                'repas2.jpg',
                'repas3.jpg',
            ],
            'pickupLocation' => '456 Elm St, Townsville',
            'availableSlots' => ['2024-01-03 11:00:00', '2024-01-04 15:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Headphones',
            'description' => 'Noise-cancelling headphones for immersive sound.',
            'quantity' => 20,
            'expirationDate' => '2024-10-31',
            'price' => 199.99,
            'isDonation' => true,
            'photos_offer' => [
                'repas.jpg',
                'repas2.jpg',
                'repas3.jpg',
            ],
            'pickupLocation' => '789 Oak St, Villageville',
            'availableSlots' => ['2024-01-05 12:00:00', '2024-01-06 16:00:00'],
            'isRecurring' => false,
             'user' => 'user@example.com'
        ],
        [
            'product' => 'Camera',
            'description' => 'High-resolution camera for photography enthusiasts.',
            'quantity' => 3,
            'expirationDate' => '2024-09-30',
            'price' => 499.99,
            'isDonation' => false,
            'photos_offer' => [
                'repas.jpg',
                'repas2.jpg',
                'repas3.jpg',
            ],
            'pickupLocation' => '321 Pine St, Hamletville',
            'availableSlots' => ['2024-01-07 13:00:00', '2024-01-08 17:00:00'],
            'isRecurring' => true,
             'user' => 'user@example.com'
        ],
        [
            'product' => 'Smartwatch',
            'description' => 'Smartwatch with fitness tracking features.',
            'quantity' => 15,
            'expirationDate' => '2024-08-31',
            'price' => 299.99,
            'isDonation' => false,
            'photos_offer' => [
                'repas.jpg',
                'repas2.jpg',
                'repas3.jpg',
            ],
            'pickupLocation' => '654 Maple St, Boroughville',
            'availableSlots' => ['2024-01-09 14:00:00', '2024-01-10 18:00:00'],
            'isRecurring' => false,
             'user' => 'user@example.com'
        ],
    ];
    public function __construct(KernelInterface $kernel)
    {
        $this->publicPath = $kernel->getProjectDir();
    }
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $user = $this->getReference('user@example.com', User::class);

        $produits = [
            'Panier de légumes bio', 'Repas chaud', 'Baguette de pain', 'Plateau de fromages',
            'Pâtes maison', 'Soupe aux légumes', 'Tarte aux pommes', 'Yaourt nature', 
            'Viande marinée', 'Fruits de saison', 'Salade composée', 'Sandwich préparé',
            'Pâtisseries', 'Croissants du jour', 'Box surprise', 'Panier anti-gaspi'
        ];

        $descriptions = [
            'Produit frais à consommer rapidement.',
            'Préparé aujourd’hui, à récupérer avant ce soir.',
            'Panier surprise avec plusieurs produits invendus.',
            'Fait maison avec des ingrédients frais.',
            'Reste d’invendus, très bon état.',
            'Plat cuisiné avec soin, prêt à réchauffer.',
        ];

        $locations = [
            '1 rue de Paris, Paris',
            '23 avenue de Lyon, Lyon',
            '56 boulevard des Belges, Lille',
            '8 place de la République, Bordeaux',
            '10 rue Alsace Lorraine, Toulouse',
        ];

        for ($i = 0; $i < 100; $i++) {
            $offer = new Offer();
            $offer->setProduct($faker->randomElement($produits));
            $offer->setDescription($faker->randomElement($descriptions));
            $offer->setQuantity($faker->numberBetween(1, 10));
            $offer->setExpirationDate($faker->dateTimeBetween('now', '+10 days'));
            $offer->setPrice($faker->randomFloat(2, 0, 10)); // De 0 à 10€
            $offer->setIsDonation($faker->boolean(20)); // 20% de dons
            $offer->setPickupLocation($faker->randomElement($locations));
            $offer->setIsRecurring($faker->boolean(30)); // 30% de chances

            // Création de 1 à 3 créneaux horaires
            $slots = [];
            for ($j = 0; $j < rand(1, 3); $j++) {
                $slots[] = $faker->dateTimeBetween('now', '+7 days')->format('Y-m-d H:i:s');
            }
            $offer->setAvailableSlots($slots);

            // Simuler des fichiers existants (même images réutilisées pour l'instant)
            $photos = new ArrayCollection();
            foreach (['repas.jpg', 'repas2.jpg', 'repas3.jpg'] as $img) {
                $photoPath = $this->publicPath.'/public/uploads/offers-photos/' . $img;
                $photos[] = new File($photoPath);
            }
            $offer->setPhotosFileOffers($photos->toArray());

            $offer->setUser($user);

            $manager->persist($offer);
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
