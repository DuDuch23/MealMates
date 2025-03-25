<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Category;

class UserFixtures extends Fixture
{
    public $hasher;
    public function __construct(UserPasswordHasherInterface $hasher) 
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Récupérer les catégories (assurez-vous que les catégories sont déjà persistées)
        $category1 = $this->getReference(CategoryFixtures::VEGAN, Category::class);
        $category2 = $this->getReference(CategoryFixtures::GLUTEN_FREE, Category::class);
        $category3 = $this->getReference(CategoryFixtures::HIGH_PROTEIN, Category::class);

        // Création de l'utilisateur 1
        $user1 = new User();
        $user1->setEmail("user@example.com");
        $user1->setPassword($this->hasher->hashPassword($user1, "password123"));
        $user1->setName("Alice");
        $user1->setSurname("Doe");
        $user1->setRoles(["ROLE_USER"]);
        $user1->setLocation("Paris, France");
        $user1->setEmailVerified(true);
        $user1->setSsoId(null);

        // Ajouter les catégories comme préférences pour l'utilisateur 1
        $user1->addPreferences($category1);
        $user1->addPreferences($category2);

        // Persist l'utilisateur
        $manager->persist($user1);

        // Ajouter des références pour utiliser l'utilisateur dans d'autres fixtures
        $this->addReference("user@example.com", $user1);

        // Création de l'utilisateur 2
        $user2 = new User();
        $user2->setEmail("admin@example.com");
        $user2->setPassword($this->hasher->hashPassword($user2, "adminpass"));
        $user2->setName("Bob");
        $user2->setSurname("Smith");
        $user2->setRoles(["ROLE_ADMIN"]);
        $user2->setLocation("Lyon, France");
        $user2->setEmailVerified(true);
        $user2->setSsoId("12345-abcdef");

        // Ajouter les catégories comme préférences pour l'utilisateur 2
        $user2->addPreferences($category1);
        $user2->addPreferences($category2);
        $user2->addPreferences($category3);

        // Persist l'utilisateur
        $manager->persist($user2);

        // Ajouter des références pour utiliser l'utilisateur dans d'autres fixtures
        $this->addReference("admin@example.com", $user2);

        // Enregistrer les utilisateurs dans la base de données
        $manager->flush();
    }
}
