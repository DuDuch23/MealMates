<?php

namespace App\Entity;

use App\Repository\ChatRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ChatRepository::class)]
class Chat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(["public", "private"])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["public", "private"])]
    private User $client;

    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $stripeUrl = null;

    #[ORM\ManyToOne(targetEntity: Offer::class)]
    #[Groups("public","private")]
    private Offer $offer;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["public", "private"])]
    private User $seller;

    #[ORM\OneToMany(mappedBy: 'chat', targetEntity: Message::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(["public","private"])]
    private Collection $messages;

    #[ORM\ManyToMany(targetEntity: Image::class, inversedBy: 'chats')]
    #[ORM\JoinTable(name: 'chat_image')]
    #[Groups(["public","private"])]
    private Collection $images;

    #[ORM\Column(nullable: true,length:255)]
    #[Groups(["public","private"])]
    private bool $statusChat;


    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->messages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): array
    {
        if (empty($this->statusChat) || $this->statusChat === false) {
            return [
                'message' => "La conversation n'est pas clôturée",
                'value' => false,
            ];
        } else {
            return [
                'message' => "La conversation est clôturée",
                'value' => true,
            ];
        }
    } 

    public function setStatus(bool $status): void
    {
        $this->statusChat = $status;
    }

    public function getClient(): User
    {
        return $this->client;
    }

    public function getStripeUrl(): ?string
    {
        return $this->stripeUrl;
    }

    public function setStripeUrl(?string $stripeUrl): self
    {
        $this->stripeUrl = $stripeUrl;
        return $this;
    }

    public function setClient(User $client): self
    {
        $this->client = $client;
        return $this;
    }

    public function getSeller(): User
    {
        return $this->seller;
    }

    public function setSeller(User $seller): self
    {
        $this->seller = $seller;
        return $this;
    }

    public function getOffer(): Offer
    {
        return $this->offer;
    }

    public function setOffer(Offer $offer): void
    {
        $this->offer = $offer;
    }

    /**
     * @return Collection|Message[]
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): self
    {
        if (!$this->messages->contains($message)) {
            $this->messages[] = $message;
            $message->setChat($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): self
    {
        if ($this->messages->removeElement($message)) {
            if ($message->getChat() === $this) {
                $message->setChat(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Image[]
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
        }

        return $this;
    }

    public function removeImage(Image $image): self
    {
        $this->images->removeElement($image);

        return $this;
    }
}
