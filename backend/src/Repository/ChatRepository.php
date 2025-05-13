<?php

namespace App\Repository;

use App\Entity\Chat;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Offer>
 */
class ChatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Chat::class);
    }

    public function findBySellerAndClient(int $sellerId): ?array
    {
        return $this->createQueryBuilder('c')
        ->where('c.client = :id')
        ->orWhere('c.seller = :id')
        ->setParameter('id', $sellerId)
        ->getQuery()
        ->getResult();
    }

    public function findByChat(int $sellerId, int $clientId): ?Chat
    {
        return $this->createQueryBuilder('c')
        -> where('c.client = :clientId')
        -> andWhere('c.seller = :sellerId')
        ->setParameter('clientId', $clientId)
        ->setParameter('sellerId', $sellerId)
        ->getQuery()
        ->getOneOrNullResult();
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
