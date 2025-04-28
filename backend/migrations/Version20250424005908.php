<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250424005908 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE offer_category (offer_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_7F31A9A353C674EE (offer_id), INDEX IDX_7F31A9A312469DE2 (category_id), PRIMARY KEY(offer_id, category_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE `order` (id INT AUTO_INCREMENT NOT NULL, buyer_id INT NOT NULL, offer_id INT NOT NULL, purchased_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_F52993986C755722 (buyer_id), INDEX IDX_F529939853C674EE (offer_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
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
            ALTER TABLE category_offer DROP FOREIGN KEY FK_C1E5C87753C674EE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE category_offer DROP FOREIGN KEY FK_C1E5C87712469DE2
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE category_offer
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE category_offer (category_id INT NOT NULL, offer_id INT NOT NULL, INDEX IDX_C1E5C87712469DE2 (category_id), INDEX IDX_C1E5C87753C674EE (offer_id), PRIMARY KEY(category_id, offer_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = '' 
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE category_offer ADD CONSTRAINT FK_C1E5C87753C674EE FOREIGN KEY (offer_id) REFERENCES offer (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE category_offer ADD CONSTRAINT FK_C1E5C87712469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE
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
            DROP TABLE offer_category
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE `order`
        SQL);
    }
}
