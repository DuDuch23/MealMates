<?php
namespace App\Enum;

enum PreferenceEnum : string
{
    case Vegetarien = "Végétarien";
    case Vegan = "Végan";
    case SansGluten = "Sans gluten";
    case SansLactose = "Sans lactose";
}