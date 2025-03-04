<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public $hasher;
    public function __construct(UserPasswordHasherInterface $hasher) 
    {
        $this->hasher = $hasher;
    }
    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $user->setName("Name");
        $user->setSurname("Surname");
        $user->setEmail("email@example.com");
        $user->setPassword($this->hasher->hashPassword($user, "example"));

        $manager->persist($user);
        $manager->flush();
    }
}
