<?php

namespace App\DataFixtures;

use Faker\Factory;
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
            'product' => 'Panier de fruits',
            'description' => 'Un assortiment de fruits frais de saison, idéal pour une collation saine.',
            'quantity' => 8,
            'expirationDate' => '2024-12-20',
            'price' => 12.50,
            'isDonation' => false,
            'photos_offer' => [
                'fruits.jpg',
                'fruits2.jpg',
                'fruits3.jpg',
            ],
            'pickupLocation' => '12 Rue des Vergers, Fruittown',
            'availableSlots' => ['2024-04-20 10:00:00', '2024-04-21 15:00:00'],
            'isRecurring' => true,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Plat cuisiné végétarien',
            'description' => 'Délicieux curry de légumes maison, prêt à être réchauffé.',
            'quantity' => 5,
            'expirationDate' => '2024-04-25',
            'price' => 6.90,
            'isDonation' => false,
            'photos_offer' => [
                'curry.jpg',
                'curry2.jpg',
                'curry3.jpg',
            ],
            'pickupLocation' => '34 Avenue des Plats, Cuisinetown',
            'availableSlots' => ['2024-04-22 11:00:00', '2024-04-23 14:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Pain maison',
            'description' => 'Pain au levain artisanal fait le matin même. Bio et local.',
            'quantity' => 10,
            'expirationDate' => '2024-04-16',
            'price' => 3.20,
            'isDonation' => true,
            'photos_offer' => [
                'pain.jpg',
                'pain2.jpg',
                'pain3.jpg',
            ],
            'pickupLocation' => '7 Rue du Four, Breadville',
            'availableSlots' => ['2024-04-15 08:00:00', '2024-04-15 12:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Soupe maison',
            'description' => 'Soupe de potiron faite maison, parfaite pour les soirées fraîches.',
            'quantity' => 6,
            'expirationDate' => '2024-04-28',
            'price' => 4.50,
            'isDonation' => false,
            'photos_offer' => [
                'soupe.jpg',
                'soupe2.jpg',
                'soupe3.jpg',
            ],
            'pickupLocation' => '98 Boulevard des Saveurs, Souptown',
            'availableSlots' => ['2024-04-26 17:00:00', '2024-04-27 19:00:00'],
            'isRecurring' => true,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Pâtisseries maison',
            'description' => 'Assortiment de gâteaux faits maison : cookies, muffins, et brownies.',
            'quantity' => 12,
            'expirationDate' => '2024-04-30',
            'price' => 8.90,
            'isDonation' => false,
            'photos_offer' => [
                'gateaux.jpg',
                'gateaux2.jpg',
                'gateaux3.jpg',
            ],
            'pickupLocation' => '56 Allée du Sucre, Dessertville',
            'availableSlots' => ['2024-04-29 16:00:00', '2024-04-30 18:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Lasagnes maison',
            'description' => 'Lasagnes bolognaises faites maison, généreuses et savoureuses.',
            'quantity' => 4,
            'expirationDate' => '2024-04-22',
            'price' => 7.50,
            'isDonation' => false,
            'photos_offer' => ['lasagnes.jpg', 'lasagnes2.jpg', 'lasagnes3.jpg'],
            'pickupLocation' => '10 Rue du Four, Pâtesville',
            'availableSlots' => ['2024-04-20 18:00:00', '2024-04-21 12:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Panier légumes bio',
            'description' => 'Panier composé de légumes bio de producteurs locaux.',
            'quantity' => 6,
            'expirationDate' => '2024-04-25',
            'price' => 9.00,
            'isDonation' => false,
            'photos_offer' => ['legumes.jpg', 'legumes2.jpg', 'legumes3.jpg'],
            'pickupLocation' => '21 Chemin des Champs, Agriville',
            'availableSlots' => ['2024-04-23 10:00:00', '2024-04-24 14:00:00'],
            'isRecurring' => true,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Confitures artisanales',
            'description' => '3 pots de confitures maison : fraise, abricot, et mûre.',
            'quantity' => 3,
            'expirationDate' => '2025-01-01',
            'price' => 5.00,
            'isDonation' => false,
            'photos_offer' => ['confiture.jpg', 'confiture2.webp', 'confiture3.jpg'],
            'pickupLocation' => '14 Impasse des Douceurs, Jamville',
            'availableSlots' => ['2024-04-26 09:00:00', '2024-04-27 11:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Bouteilles de jus pressé',
            'description' => 'Jus d’orange et pomme pressés du jour.',
            'quantity' => 10,
            'expirationDate' => '2024-04-18',
            'price' => 2.50,
            'isDonation' => false,
            'photos_offer' => ['jus.jpg', 'jus2.jpg', 'jus3.jpg','jus4.jpg'],
            'pickupLocation' => '5 Rue de la Fontaine, Juicecity',
            'availableSlots' => ['2024-04-16 16:00:00', '2024-04-17 10:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Yaourts faits maison',
            'description' => 'Lot de 6 yaourts natures faits maison.',
            'quantity' => 6,
            'expirationDate' => '2024-04-19',
            'price' => 4.20,
            'isDonation' => true,
            'photos_offer' => ['yaourt.jpg', 'yaourt2.jpg', 'yaourt3.jpg'],
            'pickupLocation' => '8 Rue du Lait, Creamtown',
            'availableSlots' => ['2024-04-17 14:00:00', '2024-04-18 09:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Tarte aux pommes',
            'description' => 'Tarte maison aux pommes caramélisées.',
            'quantity' => 1,
            'expirationDate' => '2024-04-16',
            'price' => 5.00,
            'isDonation' => false,
            'photos_offer' => ['tarte.jpg', 'tarte2.jpg', 'tarte3.jpg'],
            'pickupLocation' => '17 Avenue du Dessert, Tarttown',
            'availableSlots' => ['2024-04-15 17:00:00', '2024-04-16 13:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Riz sauté aux légumes',
            'description' => 'Plat asiatique prêt à déguster, riche en saveurs.',
            'quantity' => 7,
            'expirationDate' => '2024-04-20',
            'price' => 6.80,
            'isDonation' => false,
            'photos_offer' => ['riz.jpg', 'riz2.jpg', 'riz3.jpg'],
            'pickupLocation' => '89 Rue d’Asie, Wokville',
            'availableSlots' => ['2024-04-18 12:00:00', '2024-04-19 19:00:00'],
            'isRecurring' => true,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Crêpes maison',
            'description' => 'Lot de 10 crêpes prêtes à garnir, fraîches du jour.',
            'quantity' => 10,
            'expirationDate' => '2024-04-17',
            'price' => 4.50,
            'isDonation' => true,
            'photos_offer' => ['crepes.jpg', 'crepes2.jpg', 'crepes3.jpg'],
            'pickupLocation' => '45 Rue Bretonne, Crêpeville',
            'availableSlots' => ['2024-04-15 11:00:00', '2024-04-16 15:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Quiche lorraine',
            'description' => 'Quiche maison à base de lardons, crème et fromage.',
            'quantity' => 2,
            'expirationDate' => '2024-04-18',
            'price' => 6.00,
            'isDonation' => false,
            'photos_offer' => ['quiche.jpg', 'quiche2.jpg', 'quiche3.webp'],
            'pickupLocation' => '33 Allée de Lorraine, Quichecity',
            'availableSlots' => ['2024-04-16 18:00:00', '2024-04-17 12:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Chili sin carne',
            'description' => 'Version végétarienne du chili, épicée et savoureuse.',
            'quantity' => 5,
            'expirationDate' => '2024-04-21',
            'price' => 7.00,
            'isDonation' => false,
            'photos_offer' => ['chili.jpg', 'chili2.jpg', 'chili3.webp'],
            'pickupLocation' => '66 Rue Mexicaine, Spicytown',
            'availableSlots' => ['2024-04-19 13:00:00', '2024-04-20 17:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Galettes de légumes',
            'description' => 'Galettes croustillantes à base de courgettes et carottes.',
            'quantity' => 6,
            'expirationDate' => '2024-04-22',
            'price' => 5.50,
            'isDonation' => false,
            'photos_offer' => ['galettes.jpg', 'galettes2.jpg', 'galettes3.jpg'],
            'pickupLocation' => '3 Rue Végétale, Veggiecity',
            'availableSlots' => ['2024-04-20 12:00:00', '2024-04-21 16:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Mini sandwichs apéro',
            'description' => 'Assortiment de 12 mini sandwichs pour l’apéritif.',
            'quantity' => 12,
            'expirationDate' => '2024-04-19',
            'price' => 10.00,
            'isDonation' => false,
            'photos_offer' => ['sandwich.jpg', 'sandwich2.jpg', 'sandwich3.jpg'],
            'pickupLocation' => '102 Rue des Fêtes, Apéritown',
            'availableSlots' => ['2024-04-17 17:00:00', '2024-04-18 19:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Pizzas maison',
            'description' => '2 pizzas marguerita prêtes à cuire.',
            'quantity' => 2,
            'expirationDate' => '2024-04-20',
            'price' => 9.90,
            'isDonation' => false,
            'photos_offer' => ['pizza.jpg', 'pizza2.jpg', 'pizza3.jpg'],
            'pickupLocation' => '77 Route de Naples, Pizzaville',
            'availableSlots' => ['2024-04-18 18:30:00', '2024-04-19 20:00:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
        [
            'product' => 'Croissants frais',
            'description' => 'Lot de 6 croissants tout juste sortis du four.',
            'quantity' => 6,
            'expirationDate' => '2024-04-16',
            'price' => 4.80,
            'isDonation' => true,
            'photos_offer' => ['croissants.jpg', 'croissants2.jpg', 'croissants3.jpg'],
            'pickupLocation' => '11 Rue du Petit Déjeuner, Brunchville',
            'availableSlots' => ['2024-04-15 08:30:00', '2024-04-15 10:30:00'],
            'isRecurring' => false,
            'user' => 'user@example.com'
        ],
    ];

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
            foreach (self::OFFERS[$i]['photos_offer'] as $img) {
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
