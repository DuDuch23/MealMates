<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ImageRepository;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[Vich\Uploadable]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(["public", "private"])] 
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["public", "private"])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(["public", "private"])]
    private ?string $link = null;

    #[Vich\UploadableField(mapping: "images", fileNameProperty: "link")]
    private ?File $imageFile = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\ManyToMany(targetEntity: Offer::class, mappedBy: 'images')]
    #[Groups(["public", "private"])]
    private Collection $offers;


    #[ORM\ManyToMany(targetEntity: Chat::class, mappedBy: 'images')]
    private Collection $chats;

    public function __construct()
    {
        $this->offers = new ArrayCollection();
        $this->chats = new ArrayCollection();
    }

    // Getters and Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(string $link): void
    {
        $this->link = $link;
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    // offre
    public function getOffres(): Collection
    {
        return $this->offers;
    }

    public function addOffre(Offer $offer): void
    {
        $this->offers->add($offer);
    }

    public function removeOffer(Offer $offer): void
    {
        $this->offers->removeElement($offer);
    }

    // chat
    public function getChats(): Collection
    {
        return $this->chats;
    }

    public function addChat(Chat $chat): void
    {
        $this->chats->add($chat);
    }

    public function removeChat(Chat $chat): void
    {
        $this->chats->removeElement($chat);
    }
}