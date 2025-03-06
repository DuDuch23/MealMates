<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Enum\PreferenceEnum;

class UserFixtures extends Fixture
{
    public $hasher;
    public const USERS = [
        [
            "email" => "email@example.com",
                "password" => "example",
                "name" => "Name",
                "surname" => "Surname",
                "role" => "ROLE_USER",
                "preferences" => [PreferenceEnum::Vegan]
        ],
        [
            "email" => "admin@example.com",
                "password" => "example",
                "name" => "Name",
                "surname" => "Surname",
                "role" => "ROLE_ADMIN",
                "preferences" => [PreferenceEnum::Vegan, PreferenceEnum::SansLactose]
        ]
    ];
    public function __construct(UserPasswordHasherInterface $hasher) 
    {
        $this->hasher = $hasher;
    }
    public function load(ObjectManager $manager): void
    {
        foreach ($this::USERS as $user) {
            $obj = new User();
            $obj->setName($user["name"]);
            $obj->setSurname($user["surname"]);
            $obj->setEmail($user["email"]);
            $obj->setPassword($this->hasher->hashPassword($obj, $user["password"]));
            $obj->setRoles([$user["role"]]);
            $obj->setPreferences($user["preferences"]);

            $manager->persist($obj);
        }
        $manager->flush();
    }
}
