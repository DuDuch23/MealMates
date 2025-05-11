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
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function getLasChat(EntityManagerInterface $entityManager,int $chatId,int $userId)
    {
        $messages = $entityManager->createQueryBuilder()
            ->select('m.content')
            ->from('App\Entity\Message', 'm')
            ->where('m.chat = :chatId')
            ->andWhere('m.sender = :userId')
            ->orderBy('m.sentAt', 'ASC')
            ->setParameter('chatId', $chatId)
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
