<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

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

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "givenRatings")]
    #[ORM\JoinColumn(nullable: false)]
    private User $rater;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "receivedRatings")]
    #[ORM\JoinColumn(nullable: false)]
    private User $rated;

    #[ORM\Column(type: "integer")]
    #[Assert\Range(min: 1, max: 5)]
    private int $score;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $comment = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRater(): User
    {
        return $this->rater;
    }

    public function setRater(User $rater): self
    {
        $this->rater = $rater;
        return $this;
    }

    public function getRated(): User
    {
        return $this->rated;
    }

    public function setRated(User $rated): self
    {
        $this->rated = $rated;
        return $this;
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
}
