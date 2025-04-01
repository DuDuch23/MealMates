<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250321122122 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE rating (id INT AUTO_INCREMENT NOT NULL, rater_id INT NOT NULL, rated_id INT NOT NULL, score INT NOT NULL, comment LONGTEXT DEFAULT NULL, INDEX IDX_D88926223FC1CD0A (rater_id), INDEX IDX_D88926224AB3C549 (rated_id), UNIQUE INDEX unique_rater_rated (rater_id, rated_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE rating ADD CONSTRAINT FK_D88926223FC1CD0A FOREIGN KEY (rater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE rating ADD CONSTRAINT FK_D88926224AB3C549 FOREIGN KEY (rated_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD preferences LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:simple_array)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rating DROP FOREIGN KEY FK_D88926223FC1CD0A');
        $this->addSql('ALTER TABLE rating DROP FOREIGN KEY FK_D88926224AB3C549');
        $this->addSql('DROP TABLE rating');
        $this->addSql('ALTER TABLE user DROP preferences');
    }
}
