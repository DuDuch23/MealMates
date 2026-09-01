<?php

namespace App\DataFixtures;

use App\Entity\Message;
use App\Entity\Chat;
use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class MessageFixtures extends Fixture implements DependentFixtureInterface
{
    public const Message = [
        [
            'chat' => 1,
            'sender' => 'user@example.com',
            'content' => 'Salut est-ce que l\'offre pour la tarte au pomme est toujours disponible',
            'sent_at' => '2025-05-15 13:55:45',
        ],
        [
            'chat' => 1,
            'sender' => 'user@example.com',
            'content' => 'Salut ! Je viens de sortir une nouvelle tarte aux pommes maison, ça t’intéresse ?',
            'sent_at' => '2025-05-15 14:01:00',
        ],
        [
            'chat' => 1,
            'sender' => 'jean.dupont@example.com',
            'content' => 'Hey ! Sérieux ? Tu les fais toi-même ?',
            'sent_at' => '2025-05-15 14:01:45',
        ],
        [
            'chat' => 1,
            'sender' => 'user@example.com',
            'content' => 'Oui, tout est fait maison : pâte sablée, pommes caramélisées, un peu de cannelle.',
            'sent_at' => '2025-05-15 14:02:30',
        ],
        [
            'chat' => 1,
            'sender' => 'jean.dupont@example.com',
            'content' => 'Ça donne trop envie ! Tu les vends combien ?',
            'sent_at' => '2025-05-15 14:03:05',
        ],
        [
            'chat' => 1,
            'sender' => 'user@example.com',
            'content' => '10€ la tarte, elles font 6 parts. Livraison possible dans le coin.',
            'sent_at' => '2025-05-15 14:03:40',
        ],
        [
            'chat' => 1,
            'sender' => 'jean.dupont@example.com',
            'content' => 'Parfait, j’en prends une pour samedi. Tu peux me la livrer vers 16h ?',
            'sent_at' => '2025-05-15 14:04:20',
        ],
        [
            'chat' => 1,
            'sender' => 'user@example.com',
            'content' => 'C’est noté, samedi 16h chez toi. Merci pour ta commande 😊',
            'sent_at' => '2025-05-15 14:05:00',
        ],
        [
            'chat' => 2,
            'sender' => 'jean.dupont@example.com',
            'content' => 'Bonjour, j’ai entendu dire que vous proposez du riz cantonais maison. Est-il toujours disponible ?',
            'sent_at' => '2025-05-15 11:45:00',
        ],
        [
            'chat' => 2,
            'sender' => 'julie.robert@example.com',
            'content' => 'Bonjour, oui bien sûr. Il est encore disponible aujourd’hui. Souhaitez-vous en savoir plus ?',
            'sent_at' => '2025-05-15 11:45:40',
        ],
        [
            'chat' => 2,
            'sender' => 'jean.dupont@example.com',
            'content' => 'Oui, avec plaisir. Pourriez-vous me décrire les ingrédients utilisés ?',
            'sent_at' => '2025-05-15 11:46:10',
        ],
        [
            'chat' => 2,
            'sender' => 'julie.robert@example.com',
            'content' => 'Il s’agit d’un riz cantonais préparé avec du riz jasmin, des œufs, des petits pois, du jambon blanc, et de la sauce soja. Le tout est cuisiné maison ce matin.',
            'sent_at' => '2025-05-15 11:47:00',
        ],
        [
            'chat' => 2,
            'sender' => 'jean.dupont@example.com',
            'content' => 'Cela semble excellent. Quel est le prix d’une portion ?',
            'sent_at' => '2025-05-15 11:47:35',
        ],
        [
            'chat' => 2,
            'sender' => 'julie.robert@example.com',
            'content' => 'Le prix est de 5 euros la portion. Je peux vous livrer si vous êtes dans le secteur.',
            'sent_at' => '2025-05-15 11:48:10',
        ],
        [
            'chat' => 1,
            'sender' => 'jean.dupont@example.com',
            'content' => 'Parfait, j’en prendrai une. Serait-il possible de l’avoir vers 12h15 ?',
            'sent_at' => '2025-05-15 11:48:45',
        ],
        [
            'chat' => 2,
            'sender' => 'julie.robert@example.com',
            'content' => 'Oui, c’est tout à fait possible. Je vous la livrerai à 12h15. Merci beaucoup.',
            'sent_at' => '2025-05-15 11:49:20',
        ],
        [
            'chat' => 3,
            'sender' => 'user@example.com',
            'content' => 'Bonjour, j’ai entendu parler de vos plats faits maison. Proposez-vous toujours du riz cantonais ?',
            'sent_at' => '2025-05-15 10:30:00',
        ],
        [
            'chat' => 3,
            'sender' => 'julie.robert@example.com',
            'content' => 'Bonjour, oui tout à fait. Le riz cantonais est disponible aujourd’hui. Souhaitez-vous en commander ?',
            'sent_at' => '2025-05-15 10:30:45',
        ],
        [
            'chat' => 3,
            'sender' => 'user@example.com',
            'content' => 'Oui, pouvez-vous m’en dire un peu plus sur la préparation ?',
            'sent_at' => '2025-05-15 10:31:10',
        ],
        [
            'chat' => 3,
            'sender' => 'julie.robert@example.com',
            'content' => 'Bien sûr. Il est préparé avec du riz jasmin, des œufs, des petits pois, du jambon blanc, et de la sauce soja. Tout est cuisiné maison ce matin.',
            'sent_at' => '2025-05-15 10:32:00',
        ],
        [
            'chat' => 3,
            'sender' => 'user@example.com',
            'content' => 'Cela semble très bon. Combien coûte une portion ?',
            'sent_at' => '2025-05-15 10:32:30',
        ],
        [
            'chat' => 3,
            'sender' => 'julie.robert@example.com',
            'content' => 'La portion est à 5 euros. Je propose également la livraison dans les environs.',
            'sent_at' => '2025-05-15 10:33:05',
        ],
        [
            'chat' => 3,
            'sender' => 'user@example.com',
            'content' => 'Parfait. Je souhaiterais en prendre une pour 12h00, à livrer si possible.',
            'sent_at' => '2025-05-15 10:33:40',
        ],
        [
            'chat' => 3,
            'sender' => 'julie.robert@example.com',
            'content' => 'Très bien, je vous livrerai une portion à 12h00. Merci pour votre commande.',
            'sent_at' => '2025-05-15 10:34:10',
        ],

    ];


    public function load(ObjectManager $manager): void
    {
        foreach (self::Message as $element) {

            // Les chats sont référencés par clé de fixture ("chat_1", "chat_2", ...)
            // plutôt que par identifiant auto-incrémenté : ce dernier dérive d'un
            // rechargement à l'autre car le purgeur des fixtures fait un DELETE,
            // pas un TRUNCATE.
            $referenceKey = 'chat_' . $element['chat'];

            if (!$this->hasReference($referenceKey, Chat::class)) {
                echo "Chat {$referenceKey} introuvable\n";
                continue;
            }

            $actualChat = $this->getReference($referenceKey, Chat::class);

            // Récupérer l'utilisateur
            $user = $this->getReference($element['sender'], User::class);
        
            // Créer un message
            $message = new Message();
            $message->setChat($actualChat);
            $message->setSender($user);
            $message->setContent($element['content']);
            $message->setSentAt(new \DateTime($element['sent_at'])); 
            $manager->persist($message);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ChatFixtures::class,
            UserFixtures::class,
            ImageFixtures::class,
        ];
    }

    
    public function getGroups(): array
    {
        return ['messages'];
    }
}
