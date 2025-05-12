<?php

namespace App\Enum;

enum OfferStatus: string
{
    case AVAILABLE = 'available';
    case RESERVED = 'reserved';
    case SOLD = 'sold';
    case EXPIRED = 'expired';

    public static function casesArray(): array
    {
        return array_column(self::cases(), 'value');
    }
}