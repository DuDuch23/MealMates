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
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(["public", "private"])]
    private ?string $surname = null;

    #[ORM\Column(type: Types::SIMPLE_ARRAY, nullable: true, enumType: PreferenceEnum::class)]
    #[Groups(["private"])]
    private ?array $preferences = null;

    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'rater', orphanRemoval: true)]
    private Collection $ratingsGiven;

    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'rated', orphanRemoval: true)]
    #[Groups(["private"])]
    private Collection $ratingsReceived;

    public function __construct()
    {
        $this->ratingsGiven = new ArrayCollection();
        $this->ratingsReceived = new ArrayCollection();
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(string $surname): static
    {
        $this->surname = $surname;

        return $this;
    }

    /**
     * @return PreferenceEnum[]|null
     */
    public function getPreferences(): ?array
    {
        return $this->preferences;
    }

    public function setPreferences(?array $preferences): static
    {
        $this->preferences = $preferences;

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
}
