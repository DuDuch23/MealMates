<?php

namespace App\Repository;

use App\Entity\Offer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Offer>
 */
class OfferRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Offer::class);
    }
    public function searchByName($keyword): array
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.product LIKE :product')
            ->setParameter('product', '%' . $keyword . '%')
            ->getQuery()
            ->getResult()
        ;
    }

    public function getVeganOffers(int $limit = 10, int $offset = 0): array
    {
        return $this->createQueryBuilder('o')
            ->innerJoin('o.categories', 'c')
            ->andWhere('c.name = :catName')
            ->setParameter('catName', 'Vegan')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    public function findOffersLocal(float $lat, float $lng, int $radiusInKm): array
{
    // Rayon de la Terre en kilomètres
    $earthRadius = 6371;

    $qb = $this->createQueryBuilder('o');

    $qb->where(
        $qb->expr()->gt('o.latitude', ':minLat')
    )->andWhere(
        $qb->expr()->lt('o.latitude', ':maxLat')
    )->andWhere(
        $qb->expr()->gt('o.longitude', ':minLng')
    )->andWhere(
        $qb->expr()->lt('o.longitude', ':maxLng')
    );

    // Calcul d'une "bounding box" simple (pas super précis mais rapide)
    $latDelta = $radiusInKm / $earthRadius * (180 / pi());
    $lngDelta = $radiusInKm / ($earthRadius * cos(deg2rad($lat))) * (180 / pi());

    $qb->setParameter('minLat', $lat - $latDelta)
        ->setParameter('maxLat', $lat + $latDelta)
        ->setParameter('minLng', $lng - $lngDelta)
        ->setParameter('maxLng', $lng + $lngDelta);

    return $qb->getQuery()->getResult();
}

    public function findLastChance(int $limit = 10, int $offset = 0): array
    {
        $now = new \DateTimeImmutable('now');
        $inTwoDays = $now->modify('+2 days')->setTime(23, 59, 59);

        return $this->createQueryBuilder('o')
            ->andWhere('o.expirationDate BETWEEN :now AND :inTwoDays')
            ->setParameter('now', $now)
            ->setParameter('inTwoDays', $inTwoDays)
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findOffersBoughtByUser(int $userId): array
    {
        return $this->createQueryBuilder('o')
            ->join('o.orders', 'ord')
            ->join('ord.buyer', 'b')
            ->where('b.id = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();
    }

    public function findByFilters(array $criteria)
    {
        $qb = $this->createQueryBuilder('o')
            ->andWhere('o.latitude IS NOT NULL')
            ->andWhere('o.longitude IS NOT NULL');

        if (!empty($criteria['type'])) {
            $qb->andWhere('o.type = :type')
            ->setParameter('type', $criteria['type']);
        }

        if (!empty($criteria['expiryBefore'])) {
            $expiryDate = new \DateTime($criteria['expiryBefore']);
            $qb->andWhere('o.expiryDate <= :expiryDate')
            ->setParameter('expiryDate', $expiryDate);
        }

        if (!empty($criteria['priceRange']) && count($criteria['priceRange']) === 2) {
            $qb->andWhere('o.price BETWEEN :minPrice AND :maxPrice')
            ->setParameter('minPrice', $criteria['priceRange'][0])
            ->setParameter('maxPrice', $criteria['priceRange'][1]);
        }

        if (!empty($criteria['minRating'])) {
            $qb->andWhere('o.rating >= :minRating')
            ->setParameter('minRating', $criteria['minRating']);
        }

        if (!empty($criteria['selectedCategories']) && is_array($criteria['selectedCategories'])) {
            // Supposons que tu as une relation ManyToMany entre offer et category
            $qb->join('o.categories', 'c')
            ->andWhere('c.id IN (:catIds)')
            ->setParameter('catIds', $criteria['selectedCategories']);
        }

        // Pour la distance, tu dois filtrer selon la position utilisateur + distance max
        // Cela nécessite les coordonnées de l'utilisateur (lat/lng) dans $criteria
        if (!empty($criteria['userLat']) && !empty($criteria['userLng']) && !empty($criteria['distance'])) {
            $userLat = $criteria['userLat'];
            $userLng = $criteria['userLng'];
            $distanceKm = $criteria['distance'];

            // Calcul de distance via formule Haversine en SQL (exemple basique, à adapter selon SGBD)
            $qb->andWhere('
                (6371 * acos(
                    cos(radians(:userLat)) * cos(radians(o.latitude)) *
                    cos(radians(o.longitude) - radians(:userLng)) +
                    sin(radians(:userLat)) * sin(radians(o.latitude))
                )) <= :distanceKm
            ')
            ->setParameter('userLat', $userLat)
            ->setParameter('userLng', $userLng)
            ->setParameter('distanceKm', $distanceKm);
        }

        return $qb->getQuery()->getResult();
    }

    public function findExpiredOffers(): array
    {
        return $this->createQueryBuilder('o')
            ->where('o.expirationDate < :now')
            ->setParameter('now', new \DateTimeImmutable())
            ->getQuery()
            ->getResult();
    }

    public function findExpiringOffersIn7Days(): array
    {
        return $this->createQueryBuilder('o')
            ->where('o.expirationDate BETWEEN :today AND :nextWeek')
            ->orderBy('o.expirationDate', 'DESC')
            ->setParameter('today', new \DateTime())
            ->setParameter('nextWeek', (new \DateTime())->modify('+7 days'))
            ->getQuery()
            ->getResult();
    }


//    /**
//     * @return Offer[] Returns an array of Offer objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('o.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Offer
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
