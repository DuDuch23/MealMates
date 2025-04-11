<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250404142124 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE category_offer (category_id INT NOT NULL, offer_id INT NOT NULL, INDEX IDX_C1E5C87712469DE2 (category_id), INDEX IDX_C1E5C87753C674EE (offer_id), PRIMARY KEY(category_id, offer_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE offer (id INT AUTO_INCREMENT NOT NULL, seller_id INT NOT NULL, product VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, quantity INT NOT NULL, expiration_date DATETIME NOT NULL, price DOUBLE PRECISION DEFAULT NULL, is_donation TINYINT(1) NOT NULL, photos_name_offer JSON DEFAULT NULL COMMENT '(DC2Type:json)', pickup_location VARCHAR(255) DEFAULT NULL, available_slots JSON DEFAULT NULL COMMENT '(DC2Type:json)', is_recurring TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_29D6873E8DE820D9 (seller_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE rating (id INT AUTO_INCREMENT NOT NULL, rater_id INT NOT NULL, rated_id INT NOT NULL, score INT NOT NULL, comment LONGTEXT DEFAULT NULL, INDEX IDX_D88926223FC1CD0A (rater_id), INDEX IDX_D88926224AB3C549 (rated_id), UNIQUE INDEX unique_rater_rated (rater_id, rated_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL COMMENT '(DC2Type:json)', password VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, location VARCHAR(255) DEFAULT NULL, is_verified TINYINT(1) DEFAULT 0 NOT NULL, verification_token VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_category (user_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_E6C1FDC1A76ED395 (user_id), INDEX IDX_E6C1FDC112469DE2 (category_id), PRIMARY KEY(user_id, category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE category_offer ADD CONSTRAINT FK_C1E5C87712469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE category_offer ADD CONSTRAINT FK_C1E5C87753C674EE FOREIGN KEY (offer_id) REFERENCES offer (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer ADD CONSTRAINT FK_29D6873E8DE820D9 FOREIGN KEY (seller_id) REFERENCES user (id)
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
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE category_offer DROP FOREIGN KEY FK_C1E5C87712469DE2
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE category_offer DROP FOREIGN KEY FK_C1E5C87753C674EE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer DROP FOREIGN KEY FK_29D6873E8DE820D9
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
            DROP TABLE category
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE category_offer
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE offer
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
    }
}
