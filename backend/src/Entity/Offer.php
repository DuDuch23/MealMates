<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;
use App\Repository\OfferRepository;

#[ORM\Entity(repositoryClass: OfferRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Offer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "offers")]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $seller = null;

    #[ORM\Column(type: "string", length: 255)]
    #[Assert\NotBlank]
    private string $product;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: "integer")]
    #[Assert\Positive]
    private int $quantity;

    #[ORM\Column(type: "datetime")]
    #[Assert\NotBlank]
    private \DateTimeInterface $expirationDate;

    #[ORM\Column(type: "float", nullable: true)]
    #[Assert\GreaterThanOrEqual(0)]
    private ?float $price = null;

    #[ORM\Column(type: "boolean")]
    private bool $isDonation = false;

    #[ORM\Column(type: "json", nullable: true)]
    private ?array $photos = [];

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private ?string $pickupLocation = null;

    #[ORM\Column(type: "json", nullable: true)]
    private ?array $availableSlots = [];

    #[ORM\Column(type: "boolean")]
    private bool $isRecurring = false;

    #[ORM\Column(type: "datetime")]
    private \DateTimeInterface $createdAt;

    #[ORM\Column(type: "datetime", nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->photos = [];
        $this->availableSlots = [];
    }

    #[ORM\PreUpdate]
    public function setUpdatedAt(): void
    {
        $this->updatedAt = new \DateTime();
    }

    // Getters et Setters

    public function getId(): ?int { return $this->id; }

    public function getUser(): ?User { return $this->seller; }
    public function setUser(?User $seller): static { $this->seller = $seller; return $this; }

    public function getProduct(): string { return $this->product; }
    public function setProduct(string $product): static { $this->product = $product; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getQuantity(): int { return $this->quantity; }
    public function setQuantity(int $quantity): static { $this->quantity = $quantity; return $this; }

    public function getExpirationDate(): \DateTimeInterface { return $this->expirationDate; }
    public function setExpirationDate(\DateTimeInterface $expirationDate): static { $this->expirationDate = $expirationDate; return $this; }

    public function getPrice(): ?float { return $this->price; }
    public function setPrice(?float $price): static { $this->price = $price; return $this; }

    public function getIsDonation(): bool { return $this->isDonation; }
    public function setIsDonation(bool $isDonation): static { $this->isDonation = $isDonation; return $this; }

    public function getPhotos(): array { return $this->photos; }
    public function setPhotos(array $photos): static { $this->photos = $photos; return $this; }

    public function getPickupLocation(): ?string { return $this->pickupLocation; }
    public function setPickupLocation(?string $pickupLocation): static { $this->pickupLocation = $pickupLocation; return $this; }

    public function getAvailableSlots(): array { return $this->availableSlots; }
    public function setAvailableSlots(array $availableSlots): static { $this->availableSlots = $availableSlots; return $this; }

    public function getIsRecurring(): bool { return $this->isRecurring; }
    public function setIsRecurring(bool $isRecurring): static { $this->isRecurring = $isRecurring; return $this; }

    public function getCreatedAt(): \DateTimeInterface { return $this->createdAt; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
}