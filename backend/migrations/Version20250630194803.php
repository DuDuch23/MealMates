<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250630194803 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rating ADD order_id INT NOT NULL, ADD punctuality INT NOT NULL, ADD communication INT NOT NULL, ADD quality INT NOT NULL, ADD created_at DATETIME NOT NULL');
        $this->addSql('ALTER TABLE rating ADD CONSTRAINT FK_D88926228D9F6D38 FOREIGN KEY (order_id) REFERENCES `order` (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_D88926228D9F6D38 ON rating (order_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rating DROP FOREIGN KEY FK_D88926228D9F6D38');
        $this->addSql('DROP INDEX IDX_D88926228D9F6D38 ON rating');
        $this->addSql('ALTER TABLE rating DROP order_id, DROP punctuality, DROP communication, DROP quality, DROP created_at');
    }
}
