<?php

namespace App\Repository;

use App\Entity\Chat;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<Offer>
 */
class ChatRepository extends ServiceEntityRepository
{
    private EntityManagerInterface $entityManager;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $entityManager)
    {
        parent::__construct($registry, Chat::class);
        $this->entityManager = $entityManager;
    }


    public function findBySellerAndClient(int $userId): array
    {
        $query = $this->entityManager->createQuery(
            'SELECT 
                m.content, 
                c.id AS idChat, 
                m.sentAt,
                CASE 
                    WHEN client.id = :userId THEN seller.id
                    ELSE client.id
                END AS otherUserId
             FROM App\Entity\Message m
             JOIN m.chat c
             JOIN c.client client
             JOIN c.seller seller
             WHERE (client.id = :userId OR seller.id = :userId)
               AND m.sentAt = (
                   SELECT MAX(m2.sentAt)
                   FROM App\Entity\Message m2
                   WHERE m2.chat = c
               )
             ORDER BY m.sentAt DESC'
        )->setParameter('userId', $userId);
            
        return $query->getResult();
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
