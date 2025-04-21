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
            $offer->setIsVegan($faker->boolean(30));

            // Création de 1 à 3 créneaux horaires
            $slots = [];
            for ($j = 0; $j < rand(1, 3); $j++) {
                $slots[] = $faker->dateTimeBetween('now', '+7 days')->format('Y-m-d H:i:s');
            }
            $offer->setAvailableSlots($slots);

            $photosDirectory = $this->publicPath . '/public/uploads/offers-photos';

            // Récupère tous les fichiers d'images (jpg, png, etc.)
            $availablePhotos = glob($photosDirectory . '/*.{jpg,jpeg,png,webp}', GLOB_BRACE);

            // Si on trouve des images valides
            if (!empty($availablePhotos)) {
                $photos = new ArrayCollection();

                // Sélection aléatoire de 1 à 3 images
                $selectedPhotos = $faker->randomElements($availablePhotos, rand(1, 3));

                foreach ($selectedPhotos as $photoPath) {
                    if (file_exists($photoPath)) {
                        $photos[] = new File($photoPath);
                    }
                }

                $offer->setPhotosFileOffers($photos->toArray());
            }

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
