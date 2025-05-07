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

    public function findLastChance(): array
    {
        $today = new \DateTimeImmutable('today 23:59:59');
        return $this->createQueryBuilder('o')
            ->andWhere('o.expirationDate <= :today')
            ->setParameter('today', $today)
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
