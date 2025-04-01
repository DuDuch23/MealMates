<?php

namespace App\DataFixtures;

use App\Entity\Offer;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Symfony\Component\HttpFoundation\File\File;

use Symfony\Component\HttpKernel\KernelInterface;


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
        foreach (self::OFFERS as $attributes) {
            $offer = new Offer();
            $offer->setProduct($attributes['product']);
            $offer->setDescription($attributes['description']);
            $offer->setQuantity($attributes['quantity']);
            $offer->setExpirationDate(new \DateTime($attributes['expirationDate']));
            $offer->setPrice($attributes['price']);
            $offer->setIsDonation($attributes['isDonation']);
            $offer->setPickupLocation($attributes['pickupLocation']);
            $offer->setAvailableSlots($attributes['availableSlots']);
            $offer->setIsRecurring($attributes['isRecurring']);

            // Ajouter les photos comme une collection
            $photos = new ArrayCollection();
            foreach ($attributes["photos_offer"] as $photo) {
                // Créer une instance de File pour chaque photo (tu dois spécifier un chemin réel ici)
                $photoPath = $this->publicPath.'/public/uploads/offers-photos/' . $photo; // Remplace par un chemin réel
                $photos[] = new File($photoPath);
            }
            $offer->setPhotosFileOffers($photos->toArray()); // Appel de la méthode définie dans l'entité

            // Récupérer un utilisateur aléatoire
            $user = $this->getReference($attributes["user"], User::class); 
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
