<?php
namespace App\Service;

use Cocur\Slugify\Slugify;
use App\Repository\OfferRepository;

class SlugService
{
    private Slugify $slugify;
    private OfferRepository $offerRepository;

    public function __construct(OfferRepository $offerRepository)
    {
        $this->slugify = new Slugify();
        $this->offerRepository = $offerRepository;
    }

    public function generateUniqueSlug(string $productName): string
    {
        $baseSlug = $this->slugify->slugify($productName);
        $slug = $baseSlug;
        $counter = 2;

        while ($this->offerRepository->findOneBy(['slug' => $slug])) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}