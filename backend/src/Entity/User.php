<?php

namespace App\Entity;

use App\Enum\PreferenceEnum;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["public", "private"])]
    private ?int $id = null;
    
    #[ORM\Column(length: 180)]
    #[Groups(["public", "private"])]
    private ?string $email = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["public", "private"])]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    #[Groups(["public", "private"])]
    #[ORM\Column(nullable: true,length:255)]
    private ?string $firstName = null;

    #[ORM\Column(nullable: true,length:255)]
    #[Groups(["public", "private"])]
    private ?string $lastName = null;

    #[ORM\ManyToMany(targetEntity: Category::class)]
    #[Groups(["public", "private"])]
    private Collection $preferences;

    #[ORM\ManyToMany(targetEntity: User::class)]
    #[Groups(["public", "private"])]
    private Collection $searchHistory;

    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'rater', orphanRemoval: true)]
    private Collection $ratingsGiven;

    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'rated', orphanRemoval: true)]
    #[Groups(["public", "private"])]
    private Collection $ratingsReceived;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(["public", "private"])]
    private ?string $location = null;

    #[ORM\Column(length:255, nullable:true)]
    #[Groups(["public","private"])]
    private int $iconUser = 1;

    #[ORM\Column(length:255, nullable:true)]
    #[Groups(["public","private"])]
    private ?string $adress = null;

    /**
     * @var Collection<int, Offer>
     */
    #[ORM\OneToMany(targetEntity: Offer::class, mappedBy: 'seller')]
    private Collection $offers;



    #[ORM\Column(options: ['default' => false])]
    private ?bool $isVerified = null;

    /**
     * @var Collection<int, Order>
     */
    #[ORM\OneToMany(targetEntity: Order::class, mappedBy: 'buyer')]
    private Collection $orders;

    // Dashboard

    #[ORM\Column(length:255, nullable:true)]
    #[Groups(["public","private"])]
    private int $totalTransactions = 0;

    #[ORM\Column(length:255, nullable:true)]
    #[Groups(["public","private"])]
    private int $itemsSaved = 0;

    #[ORM\Column(length:255, nullable:true)]
    #[Groups(["public","private"])]
    private float $moneySaved = 0.0;

    #[ORM\Column(length:255, nullable:true)]
    #[Groups(["public","private"])]
    private float $moneyEarned = 0.0;


    public function __construct()
    {
        $this->offers = new ArrayCollection();
        $this->ratingsGiven = new ArrayCollection();
        $this->ratingsReceived = new ArrayCollection();
        $this->searchHistory = new ArrayCollection();
        $this->preferences = new ArrayCollection();
        $this->orders = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function getsearchHistory(): Collection
    {
        return $this->searchHistory;
    }

    public function addSearch(SearchHistory $search): void
    {
        $this->searchHistory->add($search);
    }

    public function deleteSearch(SearchHistory $search): void
    {
        $this->searchHistory->removeElement($search);
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function getAdress(): string
    {
        return $this->adress;
    }

    public function setAdress(string $adress): void
    {
        $this->adress = $adress;
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * @return Collection<int, Category>
     */
    public function getPreferences(): Collection
    {
        return $this->preferences;
    }

    public function addPreferences(Category $preferences): self
    {
        if (!$this->preferences->contains($preferences)) {
            $this->preferences[] = $preferences;
        }

        return $this;
    }

    public function removePreferences(Category $preferences): static
    {
        $this->preferences->removeElement($preferences);

        return $this;
    }

    /**
     * @return Collection<int, Rating>
     */
    public function getRatingsGiven(): Collection
    {
        return $this->ratingsGiven;
    }

    public function addRatingGiven(Rating $ratingGiven): static
    {
        if (!$this->ratingsGiven->contains($ratingGiven)) {
            $this->ratingsGiven->add($ratingGiven);
            $ratingGiven->setRater($this);
        }

        return $this;
    }

    public function removeRatingGiven(Rating $ratingGiven): static
    {
        if ($this->ratingsGiven->removeElement($ratingGiven)) {
            // set the owning side to null (unless already changed)
            if ($ratingGiven->getRater() === $this) {
                $ratingGiven->setRater(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Rating>
     */
    public function getRatingsReceived(): Collection
    {
        return $this->ratingsReceived;
    }

    public function addRatingsReceived(Rating $ratingsReceived): static
    {
        if (!$this->ratingsReceived->contains($ratingsReceived)) {
            $this->ratingsReceived->add($ratingsReceived);
            $ratingsReceived->setRated($this);
        }

        return $this;
    }

    public function removeRatingsReceived(Rating $ratingsReceived): static
    {
        if ($this->ratingsReceived->removeElement($ratingsReceived)) {
            // set the owning side to null (unless already changed)
            if ($ratingsReceived->getRated() === $this) {
                $ratingsReceived->setRated(null);
            }
        }

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;

        return $this;
    }

    /**
     * @return Collection<int, Offer>
     */
    public function getOffers(): Collection
    {
        return $this->offers;
    }

    public function addOffer(Offer $offer): static
    {
        if (!$this->offers->contains($offer)) {
            $this->offers->add($offer);
            $offer->setSeller($this);
        }

        return $this;
    }

    public function removeOffer(Offer $offer): static
    {
        if ($this->offers->removeElement($offer)) {
            // set the owning side to null (unless already changed)
            if ($offer->getSeller() === $this) {
                $offer->setSeller(null);
            }
        }

        return $this;
    }

    public function getIconUser(): int
    {
        return $this->iconUser;
    }

    public function setIconUser(int $icon): void
    {
        $this->iconUser = $icon;
    }

    public function isVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getTotalTransactions(): int
    {
        return $this->totalTransactions;
    }
    public function setTotalTransactions(int $totalTransactions): static
    {
        $this->totalTransactions = $totalTransactions;

        return $this;
    }
    public function getItemsSaved(): int
    {
        return $this->itemsSaved;
    }
    public function setItemsSaved(int $itemsSaved): static
    {
        $this->itemsSaved = $itemsSaved;

        return $this;
    }
    public function getMoneySaved(): float
    {
        return $this->moneySaved;
    }
    public function setMoneySaved(float $moneySaved): static
    {
        $this->moneySaved = $moneySaved;

        return $this;
    }
    public function getMoneyEarned(): float
    {
        return $this->moneyEarned;
    }
    public function setMoneyEarned(float $moneyEarned): static
    {
        $this->moneyEarned = $moneyEarned;

        return $this;
    }
    

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
            $order->setBuyer($this);
        }

        return $this;
    }

    public function removeOrder(Order $order): static
    {
        if ($this->orders->removeElement($order)) {
            // set the owning side to null (unless already changed)
            if ($order->getBuyer() === $this) {
                $order->setBuyer(null);
            }
        }

        return $this;
    }
}