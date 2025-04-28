<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

class Image{
    #[ORM\Id]
    #[ORM\Column]
    #[ORM\GeneratedValue]
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

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getLink(): string
    {
        return $this->link;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function setLink(string $link): void
    {
        $this->link = $link;
    }

    public function getFile(): File
    {
        return $this->imageFile;
    }

    public function setFile(File $file): void
    {
        $this->imageFile = $file;
    }
}