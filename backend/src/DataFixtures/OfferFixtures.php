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
    public const NB_OFFERS = 100;
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
            'Paris',
            'Lyon',
            'Lille',
            'Bordeaux',
            'Toulouse',
            'Acy en multien',
            'Betz',
            'Crépy en Valois',
            'Compiègne',
            'Saint-Quentin',
            'Bordeaux',
            'Marseille',
            'Montpellier',
            'Nantes',
            'Strasbourg',
            'Marseille',
            'Nice',
            'Nîmes',
            'Nanteuil le Haudouin',
            'Jaux',
            'Chantilly',
            'Senlis',
            'Beauvais',
            'Soissons',
            'Toulouse',
        ];

        $cityCoords = [
            'Paris'                     => ['lat' => 48.8566, 'lon' => 2.3522],
            'Lyon'                      => ['lat' => 45.7640, 'lon' => 4.8357],
            'Lille'                     => ['lat' => 50.6292, 'lon' => 3.0573],
            'Bordeaux'                  => ['lat' => 44.8378, 'lon' => -0.5792],
            'Toulouse'                  => ['lat' => 43.6045, 'lon' => 1.4440],
            'Acy en multien'            => ['lat' => 49.0847, 'lon' => 3.0033],
            'Betz'                      => ['lat' => 49.1539, 'lon' => 2.9303],
            'Crépy en Valois'           => ['lat' => 49.2372, 'lon' => 2.8907],
            'Compiègne'                 => ['lat' => 49.4171, 'lon' => 2.8261],
            'Saint-Quentin'             => ['lat' => 49.8489, 'lon' => 3.2870],
            'Marseille'                 => ['lat' => 43.2965, 'lon' => 5.3698],
            'Montpellier'               => ['lat' => 43.6108, 'lon' => 3.8767],
            'Nantes'                    => ['lat' => 47.2184, 'lon' => -1.5536],
            'Strasbourg'                => ['lat' => 48.5734, 'lon' => 7.7521],
            'Nice'                      => ['lat' => 43.7102, 'lon' => 7.2620],
            'Nîmes'                     => ['lat' => 43.8367, 'lon' => 4.3601],
            'Nanteuil le Haudouin'      => ['lat' => 49.1392, 'lon' => 2.8891],
            'Jaux'                      => ['lat' => 49.3971, 'lon' => 2.8104],
            'Chantilly'                 => ['lat' => 49.1930, 'lon' => 2.4690],
            'Senlis'                    => ['lat' => 49.2096, 'lon' => 2.5869],
            'Beauvais'                  => ['lat' => 49.4295, 'lon' => 2.0810],
            'Soissons'                  => ['lat' => 49.3818, 'lon' => 3.3233],
        ];

        for ($i = 0; $i < self::NB_OFFERS; $i++) {
            $offer = new Offer();

            $productName = $faker->randomElement($produits);
            $offer->setProduct($productName);
            $slug = $slugify->slugify($productName) . '-' . uniqid();
            $offer->setSlug($slug);
            $offer->setDescription($faker->randomElement($descriptions));
            $offer->setQuantity($faker->numberBetween(1, 10));
            $offer->setExpirationDate($faker->dateTimeBetween('now', '+10 days'));
            $offer->setPrice($faker->randomFloat(2, 0, 10));
            $offer->setIsDonation($faker->boolean(20));
            $city = $faker->randomElement(array_keys($cityCoords));     // choix aléatoire
            $offer->setPickupLocation($city);
            $offer->setIsRecurring($faker->boolean(30));
            $offer->setLatitude($cityCoords[$city]['lat']);
            $offer->setLongitude($cityCoords[$city]['lon']);

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

            $offer->setSeller($seller);
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
