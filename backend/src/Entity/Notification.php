<?php

namespace App\Entity;

use App\Repository\NotificationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: NotificationRepository::class)]
class Notification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['notification'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['notification'])]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Groups(['notification'])]
    private string $title;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['notification'])]
    private ?string $message = null;

    #[ORM\Column]
    #[Groups(['notification'])]
    private bool $isRead = false;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['notification'])]
    private \DateTimeInterface $createdAt;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['notification'])]
    private ?string $type = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['notification'])]
    private ?int $targetId = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }
    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
    public function getTitle(): string
    {
        return $this->title;
    }
    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }
    public function getMessage(): ?string
    {
        return $this->message;
    }
    public function setMessage(?string $message): static
    {
        $this->message = $message;

        return $this;
    }
    public function isRead(): bool
    {
        return $this->isRead;
    }
    public function setIsRead(bool $isRead): static
    {
        $this->isRead = $isRead;

        return $this;
    }
    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }
    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
    public function getType(): ?string
    {
        return $this->type;
    }
    public function setType(?string $type): static
    {
        $this->type = $type;

        return $this;
    }
    public function getTargetId(): ?int
    {
        return $this->targetId;
    }
    public function setTargetId(?int $targetId): static
    {
        $this->targetId = $targetId;

        return $this;
    }
    public function __toString(): string
    {
        return $this->title;
    }
    public function getNotificationType(): string
    {
        return $this->type ?? 'default';
    }
    public function setNotificationType(string $type): static
    {
        $this->type = $type;

        return $this;
    }
    public function getTarget(): ?int
    {
        return $this->targetId;
    }
    public function setTarget(?int $targetId): static
    {
        $this->targetId = $targetId;

        return $this;
    }
}
