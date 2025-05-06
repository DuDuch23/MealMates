<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250506064330 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE chat (id INT AUTO_INCREMENT NOT NULL, client_id INT NOT NULL, seller_id INT NOT NULL, INDEX IDX_659DF2AA19EB6921 (client_id), INDEX IDX_659DF2AA8DE820D9 (seller_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE chat_image (chat_id INT NOT NULL, image_id INT NOT NULL, INDEX IDX_C440E9C41A9A7125 (chat_id), INDEX IDX_C440E9C43DA5256D (image_id), PRIMARY KEY(chat_id, image_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, link VARCHAR(255) NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, chat_id INT NOT NULL, sender_id INT NOT NULL, content LONGTEXT NOT NULL, sent_at DATETIME NOT NULL, INDEX IDX_B6BD307F1A9A7125 (chat_id), INDEX IDX_B6BD307FF624B39D (sender_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE offer (id INT AUTO_INCREMENT NOT NULL, seller_id INT NOT NULL, product VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, quantity INT NOT NULL, expiration_date DATETIME NOT NULL, price DOUBLE PRECISION DEFAULT NULL, is_donation TINYINT(1) NOT NULL, pickup_location VARCHAR(255) DEFAULT NULL, available_slots JSON DEFAULT NULL COMMENT '(DC2Type:json)', is_recurring TINYINT(1) NOT NULL, is_vegan TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, latitude DOUBLE PRECISION DEFAULT NULL, longitude DOUBLE PRECISION DEFAULT NULL, INDEX IDX_29D6873E8DE820D9 (seller_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE offer_image (offer_id INT NOT NULL, image_id INT NOT NULL, INDEX IDX_461079B653C674EE (offer_id), INDEX IDX_461079B63DA5256D (image_id), PRIMARY KEY(offer_id, image_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE offer_category (offer_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_7F31A9A353C674EE (offer_id), INDEX IDX_7F31A9A312469DE2 (category_id), PRIMARY KEY(offer_id, category_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE `order` (id INT AUTO_INCREMENT NOT NULL, buyer_id INT NOT NULL, offer_id INT NOT NULL, purchased_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_F52993986C755722 (buyer_id), INDEX IDX_F529939853C674EE (offer_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE rating (id INT AUTO_INCREMENT NOT NULL, rater_id INT NOT NULL, rated_id INT NOT NULL, score INT NOT NULL, comment LONGTEXT DEFAULT NULL, INDEX IDX_D88926223FC1CD0A (rater_id), INDEX IDX_D88926224AB3C549 (rated_id), UNIQUE INDEX unique_rater_rated (rater_id, rated_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL COMMENT '(DC2Type:json)', password VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, location VARCHAR(255) DEFAULT NULL, icon_user INT DEFAULT NULL, adress VARCHAR(255) DEFAULT NULL, is_verified TINYINT(1) DEFAULT 0 NOT NULL, verification_token VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_category (user_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_E6C1FDC1A76ED395 (user_id), INDEX IDX_E6C1FDC112469DE2 (category_id), PRIMARY KEY(user_id, category_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_user (user_source INT NOT NULL, user_target INT NOT NULL, INDEX IDX_F7129A803AD8644E (user_source), INDEX IDX_F7129A80233D34C1 (user_target), PRIMARY KEY(user_source, user_target)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE chat ADD CONSTRAINT FK_659DF2AA19EB6921 FOREIGN KEY (client_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE chat ADD CONSTRAINT FK_659DF2AA8DE820D9 FOREIGN KEY (seller_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE chat_image ADD CONSTRAINT FK_C440E9C41A9A7125 FOREIGN KEY (chat_id) REFERENCES chat (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE chat_image ADD CONSTRAINT FK_C440E9C43DA5256D FOREIGN KEY (image_id) REFERENCES image (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message ADD CONSTRAINT FK_B6BD307F1A9A7125 FOREIGN KEY (chat_id) REFERENCES chat (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message ADD CONSTRAINT FK_B6BD307FF624B39D FOREIGN KEY (sender_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer ADD CONSTRAINT FK_29D6873E8DE820D9 FOREIGN KEY (seller_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image ADD CONSTRAINT FK_461079B653C674EE FOREIGN KEY (offer_id) REFERENCES offer (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image ADD CONSTRAINT FK_461079B63DA5256D FOREIGN KEY (image_id) REFERENCES image (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_category ADD CONSTRAINT FK_7F31A9A353C674EE FOREIGN KEY (offer_id) REFERENCES offer (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_category ADD CONSTRAINT FK_7F31A9A312469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE `order` ADD CONSTRAINT FK_F52993986C755722 FOREIGN KEY (buyer_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE `order` ADD CONSTRAINT FK_F529939853C674EE FOREIGN KEY (offer_id) REFERENCES offer (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rating ADD CONSTRAINT FK_D88926223FC1CD0A FOREIGN KEY (rater_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rating ADD CONSTRAINT FK_D88926224AB3C549 FOREIGN KEY (rated_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_category ADD CONSTRAINT FK_E6C1FDC1A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_category ADD CONSTRAINT FK_E6C1FDC112469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_user ADD CONSTRAINT FK_F7129A803AD8644E FOREIGN KEY (user_source) REFERENCES user (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_user ADD CONSTRAINT FK_F7129A80233D34C1 FOREIGN KEY (user_target) REFERENCES user (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE chat DROP FOREIGN KEY FK_659DF2AA19EB6921
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE chat DROP FOREIGN KEY FK_659DF2AA8DE820D9
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE chat_image DROP FOREIGN KEY FK_C440E9C41A9A7125
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE chat_image DROP FOREIGN KEY FK_C440E9C43DA5256D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F1A9A7125
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message DROP FOREIGN KEY FK_B6BD307FF624B39D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer DROP FOREIGN KEY FK_29D6873E8DE820D9
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image DROP FOREIGN KEY FK_461079B653C674EE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image DROP FOREIGN KEY FK_461079B63DA5256D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_category DROP FOREIGN KEY FK_7F31A9A353C674EE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_category DROP FOREIGN KEY FK_7F31A9A312469DE2
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE `order` DROP FOREIGN KEY FK_F52993986C755722
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE `order` DROP FOREIGN KEY FK_F529939853C674EE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rating DROP FOREIGN KEY FK_D88926223FC1CD0A
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE rating DROP FOREIGN KEY FK_D88926224AB3C549
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_category DROP FOREIGN KEY FK_E6C1FDC1A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_category DROP FOREIGN KEY FK_E6C1FDC112469DE2
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_user DROP FOREIGN KEY FK_F7129A803AD8644E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_user DROP FOREIGN KEY FK_F7129A80233D34C1
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE category
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE chat
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE chat_image
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE image
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE message
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE offer
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE offer_image
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE offer_category
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE `order`
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE rating
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_category
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_user
        SQL);
    }
}
