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
            'category1' => $this->getReference(CategoryFixtures::VEGAN, Category::class),
            'category2' => $this->getReference(CategoryFixtures::GLUTEN_FREE, Category::class),
            'category3' => $this->getReference(CategoryFixtures::HIGH_PROTEIN, Category::class)
        ];

        $users = [
            [
                'email' => 'user@example.com',
                'password' => 'password123',
                'firstName' => 'Alice',
                'lastName' => 'Doe',
                'roles' => ['ROLE_USER'],
                'location' => 'Paris, France',
                'preferences' => ['category1', 'category2']
            ],
            [
                'email' => 'admin@example.com',
                'password' => 'adminpass',
                'firstName' => 'Bob',
                'lastName' => 'Smith',
                'roles' => ['ROLE_ADMIN'],
                'location' => 'Lyon, France',
                'preferences' => ['category1', 'category2', 'category3']
            ]
        ];

        foreach ($users as $userData) {
            $user = new User();
            $user->setEmail($userData['email']);
            $user->setPassword($this->hasher->hashPassword($user, $userData['password']));
            $user->setFirstName($userData['firstName']);
            $user->setLastName($userData['lastName']);
            $user->setRoles($userData['roles']);
            $user->setLocation($userData['location']);

            foreach ($userData['preferences'] as $categoryKey) {
                $user->addPreferences($categories[$categoryKey]);
            }

            $manager->persist($user);
            $this->addReference($userData['email'], $user);
        }

        $manager->flush();
    }
}