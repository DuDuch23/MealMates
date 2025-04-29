<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250427231328 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE offer_image (offer_id INT NOT NULL, image_id INT NOT NULL, INDEX IDX_461079B653C674EE (offer_id), INDEX IDX_461079B63DA5256D (image_id), PRIMARY KEY(offer_id, image_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image ADD CONSTRAINT FK_461079B653C674EE FOREIGN KEY (offer_id) REFERENCES offer (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image ADD CONSTRAINT FK_461079B63DA5256D FOREIGN KEY (image_id) REFERENCES image (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE image DROP FOREIGN KEY FK_C53D045F53C674EE
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_C53D045F53C674EE ON image
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE image DROP offer_id
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image DROP FOREIGN KEY FK_461079B653C674EE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image DROP FOREIGN KEY FK_461079B63DA5256D
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE offer_image
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE image ADD offer_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE image ADD CONSTRAINT FK_C53D045F53C674EE FOREIGN KEY (offer_id) REFERENCES offer (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C53D045F53C674EE ON image (offer_id)
        SQL);
    }
}
