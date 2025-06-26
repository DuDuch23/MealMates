<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Repository\NotificationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/notifications', name: 'app_notification_')]
class ApiNotificationController extends AbstractController
{
    #[Route('/user', name: 'list', methods: ['GET'])]
    public function userNotifications(NotificationRepository $repo): JsonResponse
    {
        $user = $this->getUser();
        $notifications = $repo->findBy(['user' => $user], ['createdAt' => 'DESC']);

        return $this->json($notifications, 200, [], ['groups' => ['notification']]);
    }

    #[Route('/mark-as-read/{id}', name: 'read', methods: ['POST'])]
    public function markAsRead(Notification $notification, EntityManagerInterface $em): JsonResponse
    {
        $notification->setIsRead(true);
        $em->flush();
        return $this->json(['success' => true]);
    }
}