<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;
use App\Repository\OfferRepository;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: OfferRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Offer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(["public", "private"])] // Ajout des groupes pour sérialisation
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "offers")]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["public"])] // Exposé uniquement dans le groupe "private"
    private ?User $seller = null;

    #[ORM\Column(type: "string", length: 255)]
    #[Assert\NotBlank]
    #[Groups(["public", "private"])] // Exposé dans les deux groupes
    private string $product;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(["public", "private"])] // Exposé dans les deux groupes
    private ?string $description = null;

    #[ORM\Column(type: "integer")]
    #[Assert\Positive]
    #[Groups(["public", "private"])] // Exposé dans les deux groupes
    private int $quantity;

    #[ORM\Column(type: "datetime")]
    #[Assert\NotBlank]
    #[Groups(["public", "private"])] // Exposé dans les deux groupes
    private \DateTimeInterface $expirationDate;

    #[ORM\Column(type: "float", nullable: true)]
    #[Assert\GreaterThanOrEqual(0)]
    #[Groups(["public", "private"])] // Exposé dans les deux groupes
    private ?float $price = null;

    #[ORM\Column(type: "boolean")]
    #[Groups(["public"])] // Exposé uniquement dans le groupe "private"
    private bool $isDonation = false;

    #[Vich\UploadableField(mapping: 'photos_offer', fileNameProperty: 'photosNameOffer')]
    #[Groups(["private"])] // Exposé uniquement dans le groupe "private"
    private ?Collection $photosFileOffers = null;

    #[ORM\Column(type: "json", nullable: true)]
    #[Groups(["private", "public"])] // Exposé uniquement dans le groupe "private"
    private ?array $photosNameOffer = [];

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups(["public", "private"])] // Exposé dans les deux groupes
    private ?string $pickupLocation = null;

    #[ORM\Column(type: "json", nullable: true)]
    #[Groups(["private", "public"])] // Exposé uniquement dans le groupe "private"
    private ?array $availableSlots = [];

    #[ORM\Column(type: "boolean")]
    #[Groups(["private", "public"])] // Exposé uniquement dans le groupe "private"
    private bool $isRecurring = false;

    #[ORM\Column(type: "datetime")]
    #[Groups(["private", "public"])] // Exposé uniquement dans le groupe "private"
    private \DateTimeInterface $createdAt;

    #[ORM\Column(type: "datetime", nullable: true)]
    #[Groups(["private", "public"])] // Exposé uniquement dans le groupe "private"
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->photosNameOffer = [];
        $this->availableSlots = [];
        $this->photosFileOffers = new ArrayCollection();
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

     /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile|null $photosFileOffers
     */

     public function setPhotosFileOffers(?array $photosFileOffers): void
     {
         $this->photosFileOffers = new ArrayCollection(); // Réinitialise la collection
     
         // Si le tableau n'est pas nul et qu'il contient des objets File
         if ($photosFileOffers) {
             foreach ($photosFileOffers as $photo) {
                 if ($photo instanceof File) {
                     $this->photosFileOffers->add($photo); // Ajoute à la collection
                 }
             }
         }
     }
     
     /**
      * @return File[]|Collection
      */
     public function getPhotosFileOffers(): Collection
     {
         return $this->photosFileOffers ?? new ArrayCollection();
     }

    // Getter et setter pour photosNameOffer (les noms des fichiers)
    public function getPhotosNameOffer(): ?array
    {
        return $this->photosNameOffer;
    }

    public function setPhotosNameOffer(?array $photosNameOffer): void
    {
        $this->photosNameOffer = $photosNameOffer;
    }

    public function getPickupLocation(): ?string { return $this->pickupLocation; }
    public function setPickupLocation(?string $pickupLocation): static { $this->pickupLocation = $pickupLocation; return $this; }

    public function getAvailableSlots(): array { return $this->availableSlots; }
    public function setAvailableSlots(array $availableSlots): static { $this->availableSlots = $availableSlots; return $this; }

    public function getIsRecurring(): bool { return $this->isRecurring; }
    public function setIsRecurring(bool $isRecurring): static { $this->isRecurring = $isRecurring; return $this; }

    public function getCreatedAt(): \DateTimeInterface { return $this->createdAt; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
}