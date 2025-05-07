<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250505194845 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image DROP FOREIGN KEY FK_461079B63DA5256D
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image DROP FOREIGN KEY FK_461079B653C674EE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image ADD CONSTRAINT FK_461079B63DA5256D FOREIGN KEY (image_id) REFERENCES image (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image ADD CONSTRAINT FK_461079B653C674EE FOREIGN KEY (offer_id) REFERENCES offer (id) ON DELETE CASCADE
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
            ALTER TABLE offer_image ADD CONSTRAINT FK_461079B653C674EE FOREIGN KEY (offer_id) REFERENCES offer (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE offer_image ADD CONSTRAINT FK_461079B63DA5256D FOREIGN KEY (image_id) REFERENCES image (id)
        SQL);
    }
}
