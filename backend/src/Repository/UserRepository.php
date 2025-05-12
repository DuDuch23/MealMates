<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function sellersAlreadyBoughtFrom(User $buyer): array
    {
        return $this->createQueryBuilder('u')
            ->select('DISTINCT seller')
            ->innerJoin('u.orders', 'o')
            ->innerJoin('o.offer', 'of')
            ->innerJoin('of.seller', 'seller')
            ->where('u = :buyer')
            ->setParameter('buyer', $buyer)
            ->getQuery()
            ->getResult();
    }

    public function getPreferences(int $id): array
    {
        $query = $this->createQuery(
            'SELECT c.id, c.name
             FROM App\Entity\UserCategory uc
             JOIN uc.category c
             WHERE uc.user = :userId'
        );
        $query->setParameter('userId', $id);
        $results = $query->getResult();
        return $results;
    }

    // public function findLastChance(): array
    // {
    //     $today = (new \DateTime())->setTime(0,0);
    //     $tomorrow = (clone $today)->modify('+1 day');

    //     return $this->createQueryBuilder('o')
    //         ->where('o.expirationDate >= :today')
    //         ->andWhere('o.expirationDate < :tomorrow')
    //         ->setParameters(compact('today', 'tomorrow'))
    //         ->getQuery()
    //         ->getResult();
    // }

    //    /**
    //     * @return User[] Returns an array of User objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?User
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
