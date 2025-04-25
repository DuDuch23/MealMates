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

    /**
     * @param float $lat latitude de l’utilisateur
     * @param float $lng longitude de l’utilisateur
     * @param int   $radiusKm rayon en kilomètres (ex. 5)
     */
    public function findOffersLocal(float $lat, float $lng, int $radiusKm = 5): array
    {
        //   6371 = rayon moyen de la Terre en km
        $haversine = '(6371 * acos(cos(radians(:lat)) 
                    * cos(radians(o.latitude)) 
                    * cos(radians(o.longitude) - radians(:lng)) 
                    + sin(radians(:lat)) 
                    * sin(radians(o.latitude))))';

        return $this->createQueryBuilder('o')
            ->andWhere("$haversine <= :radius")
            ->setParameter('lat', $lat)
            ->setParameter('lng', $lng)
            ->setParameter('radius', $radiusKm)
            ->getQuery()
            ->getResult();
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

    public function findAgain(int $buyerId): array
    {
        return $this->_em->createQuery(
            'SELECT DISTINCT o
            FROM App\Entity\Order ord
            JOIN ord.offer o
            WHERE ord.buyer = :uid'
        )->setParameter('uid', $buyerId)
        ->setMaxResults(10)
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
