<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\UniqueConstraint(
    name: "unique_rater_rated",
    columns: ["rater_id", "rated_id"]
)]
class Rating
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "integer")]
    #[Assert\Range(min: 0, max: 5)]
    #[Groups(['private'])]
    private int $score;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(['private'])]
    private ?string $comment = null;

    #[ORM\ManyToOne(inversedBy: 'ratingsGiven')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $rater = null;

    #[ORM\ManyToOne(inversedBy: 'ratingsReceived')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $rated = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getScore(): int
    {
        return $this->score;
    }

    public function setScore(int $score): self
    {
        $this->score = $score;
        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;
        return $this;
    }

    public function getRater(): ?User
    {
        return $this->rater;
    }

    public function setRater(?User $rater): static
    {
        $this->rater = $rater;

        return $this;
    }

    public function getRated(): ?User
    {
        return $this->rated;
    }

    public function setRated(?User $rated): static
    {
        $this->rated = $rated;

        return $this;
    }
}
