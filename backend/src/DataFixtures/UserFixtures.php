<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Category;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher) 
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        $categories = [
            'category_vegan' => $this->getReference(CategoryFixtures::VEGAN, Category::class),
            'category_glutten_free' => $this->getReference(CategoryFixtures::GLUTEN_FREE, Category::class),
            'category_protein' => $this->getReference(CategoryFixtures::HIGH_PROTEIN, Category::class),
            'category_hight_protein' => $this->getReference(CategoryFixtures::HIGH_PROTEIN, Category::class),
            'category_vegetarian' => $this->getReference(CategoryFixtures::VEGETARIAN, Category::class),
            'category_organic' => $this->getReference(CategoryFixtures::ORGANIC, Category::class),
            'category_NON_GMO' => $this->getReference(CategoryFixtures::NON_GMO, Category::class),
            'category_Low_Carb' => $this->getReference(CategoryFixtures::LOW_CARB, Category::class),
            'category_LOW_FAT' => $this->getReference(CategoryFixtures::LOW_FAT, Category::class),
            'category_KETO' => $this->getReference(CategoryFixtures::KETO, Category::class),
            'category_DAIRY_FREE' => $this->getReference(CategoryFixtures::DAIRY_FREE, Category::class),
            'category_PALEO' => $this->getReference(CategoryFixtures::PALEO, Category::class),
            'category_WHOLE30' => $this->getReference(CategoryFixtures::WHOLE30, Category::class),
            'category_HALAL' => $this->getReference(CategoryFixtures::HALAL, Category::class),
        ];

        $users = [
            [
                'email' => 'user@example.com',
                'password' => 'password123',
                'firstName' => 'Alice',
                'lastName' => 'Doe',
                'roles' => ['ROLE_USER'],
                'location' => 'Paris, France',
                'preferences' => ['category_vegan', 'category_glutten_free'],
                'adress' => '',
                'icon' => 2,
            ],
            [
                'email' => 'admin@example.com',
                'password' => 'adminpass',
                'firstName' => 'Bob',
                'lastName' => 'Smith',
                'roles' => ['ROLE_ADMIN'],
                'location' => 'Lyon, France',
                'preferences' => ['category_vegan', 'category_glutten_free', 'category_hight_protein'],
                'adress' => '',
                'icon' => 5,
            ],
            [
                'email' => 'jean.dupont@example.com',
                'password' => 'azerty123',
                'firstName' => 'Jean',
                'lastName' => 'Dupont',
                'roles' => ['ROLE_USER'],
                'location' => 'Marseille, France',
                'preferences' => ['category_vegetarian', 'category_organic'],
                'adress' => '12 Rue du Panier, 13002 Marseille',
                'icon' => 1,
            ],
            [
                'email' => 'sophie.martin@example.com',
                'password' => 'bonjour2024',
                'firstName' => 'Sophie',
                'lastName' => 'Martin',
                'roles' => ['ROLE_USER'],
                'location' => 'Toulouse, France',
                'preferences' => ['category_organic', 'category_NON_GMO'],
                'adress' => '18 Avenue Jean Rieux, 31500 Toulouse',
                'icon' => 3,
            ],
            [
                'email' => 'paul.moreau@example.com',
                'password' => 'pass1234',
                'firstName' => 'Paul',
                'lastName' => 'Moreau',
                'roles' => ['ROLE_USER'],
                'location' => 'Nice, France',
                'preferences' => ['category_vegan', 'category_glutten_free'],
                'adress' => '22 Rue de France, 06000 Nice',
                'icon' => 6,
            ],
            [
                'email' => 'emma.legrand@example.com',
                'password' => 'emma456',
                'firstName' => 'Emma',
                'lastName' => 'Legrand',
                'roles' => ['ROLE_USER'],
                'location' => 'Nantes, France',
                'preferences' => ["category_Low_Carb", 'category_LOW_FAT'],
                'adress' => '5 Rue Kervégan, 44000 Nantes',
                'icon' => 4,
            ],
            [
                'email' => 'admin2@example.com',
                'password' => 'admin456',
                'firstName' => 'Luc',
                'lastName' => 'Carpentier',
                'roles' => ['ROLE_ADMIN'],
                'location' => 'Bordeaux, France',
                'preferences' => ['category_hight_protein', 'category_NON_GMO'],
                'adress' => '91 Rue Sainte-Catherine, 33000 Bordeaux',
                'icon' => 2,
            ],
            [
                'email' => 'julie.robert@example.com',
                'password' => 'julie321',
                'firstName' => 'Julie',
                'lastName' => 'Robert',
                'roles' => ['ROLE_USER'],
                'location' => 'Strasbourg, France',
                'preferences' => ['category_vegetarian', 'category_KETO'],
                'adress' => '27 Rue des Grandes Arcades, 67000 Strasbourg',
                'icon' => 7,
            ],
            [
                'email' => 'mathieu.laurent@example.com',
                'password' => 'math456',
                'firstName' => 'Mathieu',
                'lastName' => 'Laurent',
                'roles' => ['ROLE_USER'],
                'location' => 'Lille, France',
                'preferences' => ['category_glutten_free', 'category_DAIRY_FREE'],
                'adress' => '4 Rue Esquermoise, 59800 Lille',
                'icon' => 8,
            ],
            [
                'email' => 'claire.fontaine@example.com',
                'password' => 'claire789',
                'firstName' => 'Claire',
                'lastName' => 'Fontaine',
                'roles' => ['ROLE_USER'],
                'location' => 'Grenoble, France',
                'preferences' => ['category_vegan', 'category_LOW_FAT'],
                'adress' => '9 Rue de Bonne, 38000 Grenoble',
                'icon' => 9,
            ],
            [
                'email' => 'admin3@example.com',
                'password' => 'superadmin',
                'firstName' => 'Henri',
                'lastName' => 'Blanc',
                'roles' => ['ROLE_ADMIN'],
                'location' => 'Dijon, France',
                'preferences' => ['category_PALEO', 'category_Low_Carb'],
                'adress' => '13 Rue de la Liberté, 21000 Dijon',
                'icon' => 3,
            ],
            [
                'email' => 'leo.duhamel@example.com',
                'password' => 'leopass',
                'firstName' => 'Léo',
                'lastName' => 'Duhamel',
                'roles' => ['ROLE_USER'],
                'location' => 'Rouen, France',
                'preferences' => ['category_DAIRY_FREE', 'category_organic'],
                'adress' => '3 Place du Vieux-Marché, 76000 Rouen',
                'icon' => 5,
            ],
            [
                'email' => 'manon.guichard@example.com',
                'password' => 'manonpass',
                'firstName' => 'Manon',
                'lastName' => 'Guichard',
                'roles' => ['ROLE_USER'],
                'location' => 'Orléans, France',
                'preferences' => ['category_organic', 'category_DAIRY_FREE'],
                'adress' => '24 Rue de Bourgogne, 45000 Orléans',
                'icon' => 6,
            ],
            [
                'email' => 'tom.renard@example.com',
                'password' => 'tom123',
                'firstName' => 'Tom',
                'lastName' => 'Renard',
                'roles' => ['ROLE_USER'],
                'location' => 'Reims, France',
                'preferences' => ['category_KETO', 'category_WHOLE30'],
                'adress' => '8 Rue de Vesle, 51100 Reims',
                'icon' => 1,
            ],
            [
                'email' => 'marie.perrin@example.com',
                'password' => 'perrinpass',
                'firstName' => 'Marie',
                'lastName' => 'Perrin',
                'roles' => ['ROLE_USER'],
                'location' => 'Aix-en-Provence, France',
                'preferences' => ['category_Low_Carb', 'category_WHOLE30'],
                'adress' => '19 Cours Mirabeau, 13100 Aix-en-Provence',
                'icon' => 2,
            ],
            [
                'email' => 'kevin.leclerc@example.com',
                'password' => 'kevinpass',
                'firstName' => 'Kevin',
                'lastName' => 'Leclerc',
                'roles' => ['ROLE_USER'],
                'location' => 'Saint-Étienne, France',
                'preferences' => ['category_LOW_FAT', 'category_HALAL'],
                'adress' => '35 Rue des Martyrs de Vingré, 42000 Saint-Étienne',
                'icon' => 10,
            ],
        ];

        foreach ($users as $userData) {
            $user = new User();
            $user->setEmail($userData['email']);
            $user->setPassword($this->hasher->hashPassword($user, $userData['password']));
            $user->setFirstName($userData['firstName']);
            $user->setLastName($userData['lastName']);
            $user->setRoles($userData['roles']);
            $user->setLocation($userData['location']);
            $user->setIsVerified(true);
            $user->setIconUser($userData['icon']);
            $user->setAdress($userData['adress']);

            foreach ($userData['preferences'] as $categoryKey) {
                $user->addPreferences($categories[$categoryKey]);
            }

            $manager->persist($user);
            $this->addReference($userData['email'], $user);
        }

        $manager->flush();
    }
}