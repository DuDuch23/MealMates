<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Offer;
use App\Entity\Category;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;

use Symfony\Component\HttpKernel\KernelInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

use Cocur\Slugify\Slugify;

class OfferFixtures extends Fixture implements DependentFixtureInterface
{
    public const NB_OFFERS = 10;
    public const OFFER_REF_PREFIX = 'offer_';
    public $publicPath;

    public function __construct(KernelInterface $kernel)
    {
        $this->publicPath = $kernel->getProjectDir();
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');
        $slugify = new Slugify();

        $user = $this->getReference('user@example.com', User::class);
        $seller = $this->getReference('user@example.com', User::class);
        $allCatIds = array_keys(CategoryFixtures::CATEGORIES);

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

        for ($i = 0; $i < self::NB_OFFERS; $i++) {
            $offer = new Offer();

            // Choix du produit
            $productName = $faker->randomElement($produits);
            $offer->setProduct($productName);

            // Génération d’un slug unique
            $slug = $slugify->slugify($productName) . '-' . uniqid();
            $offer->setProduct($slug);

            $offer->setDescription($faker->randomElement($descriptions));
            $offer->setQuantity($faker->numberBetween(1, 10));
            $offer->setExpirationDate($faker->dateTimeBetween('now', '+10 days'));
            $offer->setPrice($faker->randomFloat(2, 0, 10));
            $offer->setIsDonation($faker->boolean(20));
            $offer->setPickupLocation($faker->randomElement($locations));
            $offer->setIsRecurring($faker->boolean(30));
            $offer->setIsVegan($faker->boolean(30));
            $offer->setLatitude(rand(-90000,90000)/1000);
            $offer->setLongitude(rand(-90000,90000)/1000);
            

            // Création de 1 à 3 créneaux horaires
            $slots = [];
            for ($j = 0; $j < rand(1, 3); $j++) {
                $slots[] = $faker->dateTimeBetween('now', '+7 days')->format('Y-m-d H:i:s');
            }
            $offer->setAvailableSlots($slots);

            $photosDirectory = $this->publicPath . '/public/uploads/offers-photos';
            $availablePhotos = glob($photosDirectory . '/*.{jpg,jpeg,png,webp}', GLOB_BRACE);

            if (!empty($availablePhotos)) {
                $photos = new ArrayCollection();
                $selectedPhotos = $faker->randomElements($availablePhotos, rand(1, 3));

                foreach ($selectedPhotos as $photoPath) {
                    if (file_exists($photoPath)) {
                        $photos[] = new File($photoPath);
                    }
                }
            }

            $randomCatCodes = $faker->randomElements($allCatIds, rand(1, 3));
            foreach ($randomCatCodes as $catCode) {
                /** @var Category $cat */
                $cat = $this->getReference($catCode, Category::class);
                $offer->addCategory($cat);
            }

            $offer->setUser($seller);
            $manager->persist($offer);

            $this->addReference(self::OFFER_REF_PREFIX . $i, $offer);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            CategoryFixtures::class,
        ];
    }
}
