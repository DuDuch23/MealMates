<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

class SearchHistory{
    #[ORM\Id]
    #[ORM\Column]
    #[ORM\GeneratedValue]
    #[Groups(["public", "private"])]
    private ?int $id = null;

    #[ORM\ManyToMany(targetEntity: User::class)]
    private Collection $user;

    #[ORM\Column]
    #[Groups(["public", "private"])]
    private ?string $search = null;

    public function __construct()
    {
        $this->user = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function GetUser(): ?Collection
    {
        return $this->user;
    }

    public function getSearch(): ?string
    {
        return $this->search;
    }

    public function AddUser(User $user): void
    {
        $this->user->add($user);
    }

    public function deleteUser(User $user): void
    {
        $this->user->removeElement($user);
    }

    public function setSearch(string $search): void
    {
        $this->search = $search;
    }
}