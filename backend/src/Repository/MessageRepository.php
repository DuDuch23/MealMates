<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<Offer>
 */
class MessageRepository extends ServiceEntityRepository
{
    private EntityManagerInterface $entityManager;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $entityManager)
    {
        parent::__construct($registry, Message::class);
        $this->entityManager = $entityManager;
    }

    public function getLastChat(int $chatId, int $userId): ?Message
    {
        return $this->createQueryBuilder('m')
            ->where('m.chat = :chatId')
            ->setParameter('chatId', $chatId)
            ->orderBy('m.sentAt', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByChat(int $chatId)
    {
        $qb = $this->entityManager->createQueryBuilder();
    
        $qb->select('m')
            ->from(Message::class, 'm')
            ->join('m.chat', 'c')
            ->where(
                $qb->expr()->orX(
                    $qb->expr()->eq('m.sender', 'c.client'),
                    $qb->expr()->eq('m.sender', 'c.seller')
                )
            )
            ->andWhere('c.id = :chatId')
            ->orderBy('m.sentAt', 'ASC')
            ->setParameter('chatId', $chatId);
                
        return $qb->getQuery()->getResult();
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
