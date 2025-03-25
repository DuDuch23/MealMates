<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixtures extends Fixture
{
    public const VEGAN = 'CATEGORY_VEGAN';
    public const VEGETARIAN = 'CATEGORY_VEGETARIAN';
    public const GLUTEN_FREE = 'CATEGORY_GLUTEN_FREE';
    public const DAIRY_FREE = 'CATEGORY_DAIRY_FREE';
    public const KETO = 'CATEGORY_KETO';
    public const PALEO = 'CATEGORY_PALEO';
    public const LOW_CARB = 'CATEGORY_LOW_CARB';
    public const HIGH_PROTEIN = 'CATEGORY_HIGH_PROTEIN';
    public const LOW_FAT = 'CATEGORY_LOW_FAT';
    public const ORGANIC = 'CATEGORY_ORGANIC';
    public const NON_GMO = 'CATEGORY_NON_GMO';
    public const HALAL = 'CATEGORY_HALAL';
    public const KOSHER = 'CATEGORY_KOSHER';
    public const WHOLE30 = 'CATEGORY_WHOLE30';

    public const CATEGORIES = [
        self::VEGAN => [
            'name' => 'Vegan'
        ],
        self::VEGETARIAN => [
            'name' => 'Vegetarian'
        ],
        self::GLUTEN_FREE => [
            'name' => 'Gluten-Free'
        ],
        self::DAIRY_FREE => [
            'name' => 'Dairy-Free'
        ],
        self::KETO => [
            'name' => 'Keto'
        ],
        self::PALEO => [
            'name' => 'Paleo'
        ],
        self::LOW_CARB => [
            'name' => 'Low Carb'
        ],
        self::HIGH_PROTEIN => [
            'name' => 'High Protein'
        ],
        self::LOW_FAT => [
            'name' => 'Low Fat'
        ],
        self::ORGANIC => [
            'name' => 'Organic'
        ],
        self::NON_GMO => [
            'name' => 'Non-GMO'
        ],
        self::HALAL => [
            'name' => 'Halal'
        ],
        self::KOSHER => [
            'name' => 'Kosher'
        ],
        self::WHOLE30 => [
            'name' => 'Whole30'
        ]
    ];

    public function load(ObjectManager $manager): void
    {
        foreach ($this::CATEGORIES as $code => $attributes) {
            $category = new Category();
            $category->setName($attributes['name']);

            $manager->persist($category);

            $this->addReference($code, $category);
        }

        $manager->flush();
    }
}

