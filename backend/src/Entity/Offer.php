<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\OfferRepository;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: OfferRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Offer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(["public", "private"])] 
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "offers")]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["public"])]
    private ?User $seller = null;

    #[ORM\Column(type: "string", length: 255)]
    #[Assert\NotBlank]
    #[Groups(["public", "private"])] 
    private string $product;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(["public", "private"])] 
    private ?string $description = null;

    #[ORM\Column(type: "integer")]
    #[Assert\Positive]
    #[Groups(["public", "private"])] 
    private int $quantity;

    #[ORM\Column(type: "datetime")]
    #[Assert\NotBlank]
    #[Groups(["public", "private"])]
    private \DateTimeInterface $expirationDate;

    #[ORM\Column(type: "float", nullable: true)]
    #[Assert\GreaterThanOrEqual(0)]
    #[Groups(["public", "private"])]
    private ?float $price = null;

    #[ORM\Column(type: "boolean")]
    #[Groups(["public"])] 
    private bool $isDonation = false;
    
    #[ORM\ManyToMany(targetEntity: Image::class, inversedBy: 'offers')]
    #[ORM\JoinTable(name: 'offer_image')]
    #[Groups(["public", "private"])]
    private Collection $images;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups(["public", "private"])]
    private ?string $pickupLocation = null;

    #[ORM\Column(type: "json", nullable: true)]
    #[Groups(["private", "public"])] 
    private ?array $availableSlots = [];

    #[ORM\Column(type: "boolean")]
    #[Groups(["private", "public"])] 
    private bool $isRecurring = false;

    #[ORM\Column(type: "boolean")]
    #[Groups(["private", "public"])]
    private bool $isVegan = false;

    #[ORM\Column(type: "datetime")]
    #[Groups(["private", "public"])]
    private \DateTimeInterface $createdAt;

    #[ORM\Column(type: "datetime", nullable: true)]
    #[Groups(["private", "public"])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: "float", nullable: true)]
    #[Groups(["public", "private"])]
    private ?float $latitude = null;

    #[ORM\Column(type: "float", nullable: true)]
    #[Groups(["public", "private"])]
    private ?float $longitude = null;

    /**
     * @var Collection<int, Order>
     */
    #[ORM\OneToMany(targetEntity: Order::class, mappedBy: 'offer')]
    private Collection $orders;

    /**
     * @var Collection<int, Category>
     */
    #[ORM\ManyToMany(targetEntity: Category::class, inversedBy: 'offers')]
    #[ORM\JoinTable(name: 'offer_category')]
    private Collection $categories;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->availableSlots = [];
        $this->images = new ArrayCollection();
        $this->orders = new ArrayCollection();
        $this->categories = new ArrayCollection();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAt(): void
    {
        $this->updatedAt = new \DateTime();
    }

    // Getters et Setters

    public function getId(): ?int 
    { 
        return $this->id; 
    }

    public function getSeller(): ?User { 
        return $this->seller; 
    }
    public function setUser(?User $seller): static { 
        $this->seller = $seller; 
        return $this; 
    }

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

    // Getter
    public function getImages(): Collection
    {
        return $this->images;
    }

    // Ajouter une image
    public function addImage(Image $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images[] = $image;
        }
        return $this;
    }

    // Retirer une image
    public function removeImage(Image $image): self
    {
        $this->images->removeElement($image);
        return $this;
    }

    public function getPickupLocation(): ?string 
    { 
        return $this->pickupLocation; 
    }
    
    public function setPickupLocation(?string $pickupLocation): static 
    { 
        $this->pickupLocation = $pickupLocation; return $this; 
    }

    public function getAvailableSlots(): array 
    { 
        return $this->availableSlots; 
    }

    public function setAvailableSlots(array $availableSlots): static 
    { 
        $this->availableSlots = $availableSlots; return $this; 
    }

    public function getIsRecurring(): bool 
    { 
        return $this->isRecurring; 
    }

    public function setIsRecurring(bool $isRecurring): static 
    { 
        $this->isRecurring = $isRecurring; return $this; 
    }
    
    public function getIsVegan(): bool {
        return $this->isVegan;
    }

    public function setIsVegan(bool $isVegan): static
    {
        $this->isVegan = $isVegan;
        return $this;
    }

    public function getCreatedAt(): \DateTimeInterface { return $this->createdAt; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }

    public function getLatitude(): ?float { return $this->latitude; }
    public function setLatitude(?float $latitude): static { $this->latitude = $latitude; return $this; }

    public function getLongitude(): ?float { return $this->longitude; }
    public function setLongitude(?float $longitude): static { $this->longitude = $longitude; return $this; }

    /**
     * @return Collection<int, Order>
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrder(Order $order): static
    {
        if (!$this->orders->contains($order)) {
            $this->orders->add($order);
            $order->setOffer($this);
        }

        return $this;
    }

    public function removeOrder(Order $order): static
    {
        if ($this->orders->removeElement($order)) {
            // set the owning side to null (unless already changed)
            if ($order->getOffer() === $this) {
                $order->setOffer(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): static
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
        }

        return $this;
    }

    public function removeCategory(Category $category): static
    {
        $this->categories->removeElement($category);

        return $this;
    }

}