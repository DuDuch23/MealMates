<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250420231448 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE category_offer (category_id INT NOT NULL, offer_id INT NOT NULL, INDEX IDX_C1E5C87712469DE2 (category_id), INDEX IDX_C1E5C87753C674EE (offer_id), PRIMARY KEY(category_id, offer_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE offer (id INT AUTO_INCREMENT NOT NULL, seller_id INT NOT NULL, product VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, quantity INT NOT NULL, expiration_date DATETIME NOT NULL, price DOUBLE PRECISION DEFAULT NULL, is_donation TINYINT(1) NOT NULL, photos_name_offer JSON DEFAULT NULL COMMENT '(DC2Type:json)', pickup_location VARCHAR(255) DEFAULT NULL, available_slots JSON DEFAULT NULL COMMENT '(DC2Type:json)', is_recurring TINYINT(1) NOT NULL, is_vegan TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, latitude DOUBLE PRECISION DEFAULT NULL, longitude DOUBLE PRECISION DEFAULT NULL, INDEX IDX_29D6873E8DE820D9 (seller_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
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
            DROP TABLE category_offer
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE offer
        SQL);
    }
}
