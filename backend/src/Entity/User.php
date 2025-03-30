<?php

namespace App\Entity;

use App\Enum\PreferenceEnum;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Component\Serializer\Annotation\Groups;

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
    #[Groups(["private"])]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(["public", "private"])]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    #[Groups(["public", "private"])]
    private ?string $lastName = null;

    #[ORM\ManyToMany(targetEntity: Category::class)]
    #[Groups(["private"])]
    private Collection $preferences;

    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'rater', orphanRemoval: true)]
    private Collection $ratingsGiven;

    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'rated', orphanRemoval: true)]
    #[Groups(["private"])]
    private Collection $ratingsReceived;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $location = null;

    #[ORM\Column]
    private ?bool $emailVerified = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ssoId = null;

    /**
     * @var Collection<int, Offer>
     */
    #[ORM\OneToMany(targetEntity: Offer::class, mappedBy: 'user')]
    private Collection $offers;

    public function __construct()
    {
        $this->ratingsGiven = new ArrayCollection();
        $this->ratingsReceived = new ArrayCollection();
        $this->offers = new ArrayCollection();
        $this->preferences = new ArrayCollection(); // Initialiser la collection de catégories
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
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

    public function addPreferences(Category $preferences): static
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

    public function isEmailVerified(): ?bool
    {
        return $this->emailVerified;
    }

    public function setEmailVerified(bool $emailVerified): static
    {
        $this->emailVerified = $emailVerified;

        return $this;
    }

    public function getSsoId(): ?string
    {
        return $this->ssoId;
    }

    public function setSsoId(?string $ssoId): static
    {
        $this->ssoId = $ssoId;

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
            $offer->setUser($this);
        }

        return $this;
    }

    public function removeOffer(Offer $offer): static
    {
        if ($this->offers->removeElement($offer)) {
            // set the owning side to null (unless already changed)
            if ($offer->getUser() === $this) {
                $offer->setUser(null);
            }
        }

        return $this;
    }
}
