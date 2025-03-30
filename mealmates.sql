-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 30 mars 2025 à 20:18
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mealmates`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(15, 'Vegan'),
(16, 'Vegetarian'),
(17, 'Gluten-Free'),
(18, 'Dairy-Free'),
(19, 'Keto'),
(20, 'Paleo'),
(21, 'Low Carb'),
(22, 'High Protein'),
(23, 'Low Fat'),
(24, 'Organic'),
(25, 'Non-GMO'),
(26, 'Halal'),
(27, 'Kosher'),
(28, 'Whole30');

-- --------------------------------------------------------

--
-- Structure de la table `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250330143213', '2025-03-30 14:32:18', 300),
('DoctrineMigrations\\Version20250330162730', '2025-03-30 16:27:36', 42);

-- --------------------------------------------------------

--
-- Structure de la table `offer`
--

CREATE TABLE `offer` (
  `id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `product` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `expiration_date` datetime NOT NULL,
  `price` double DEFAULT NULL,
  `is_donation` tinyint(1) NOT NULL,
  `photos_name_offer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`photos_name_offer`)),
  `pickup_location` varchar(255) DEFAULT NULL,
  `available_slots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`available_slots`)),
  `is_recurring` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `offer`
--

INSERT INTO `offer` (`id`, `seller_id`, `product`, `description`, `quantity`, `expiration_date`, `price`, `is_donation`, `photos_name_offer`, `pickup_location`, `available_slots`, `is_recurring`, `created_at`, `updated_at`) VALUES
(1, 2, 'test', 'test', 0, '2025-04-30 16:52:34', 5.99, 0, '[\"repas.jpg\", \"repas2.jpg\", \"repas3.jpg\"]', '123 Main St, Cityville', '[\"2024-01-01 10:00:00\", \"2024-01-02 14:00:00\"]', 1, '2025-04-30 16:52:34', NULL),
(2, 2, 'test', 'test', 0, '2025-04-30 16:52:34', 5.99, 0, '[\"repas.jpg\", \"repas2.jpg\", \"repas3.jpg\"]', '123 Main St, Cityville', '[\"2024-01-01 10:00:00\", \"2024-01-02 14:00:00\"]', 1, '2025-04-30 16:52:34', NULL),
(3, 2, 'test', 'test', 0, '2025-04-30 16:52:34', 5.99, 0, '[\"repas.jpg\", \"repas2.jpg\", \"repas3.jpg\"]', '123 Main St, Cityville', '[\"2024-01-01 10:00:00\", \"2024-01-02 14:00:00\"]', 1, '2025-04-30 16:52:34', NULL),
(4, 2, 'test', 'test', 0, '2025-04-30 16:52:34', 5.99, 0, '[\"repas.jpg\", \"repas2.jpg\", \"repas3.jpg\"]', '123 Main St, Cityville', '[\"2024-01-01 10:00:00\", \"2024-01-02 14:00:00\"]', 1, '2025-04-30 16:52:34', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `rating`
--

CREATE TABLE `rating` (
  `id` int(11) NOT NULL,
  `rater_id` int(11) NOT NULL,
  `rated_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `comment` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `rating`
--

INSERT INTO `rating` (`id`, `rater_id`, `rated_id`, `score`, `comment`) VALUES
(1, 1, 2, 5, 'Great user!'),
(2, 2, 1, 4, 'Good communication');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(180) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:json)' CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL,
  `sso_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `first_name`, `last_name`, `location`, `email_verified`, `sso_id`) VALUES
(1, 'user@example.com', '[\"ROLE_USER\"]', '$2y$13$kBWoyVHSl6WLQ1RIeJBGpOBzUe5fVw8dzPL3tm/9xVJqAC81WFlGS', 'Alice', 'Doe', 'Paris, France', 1, NULL),
(2, 'admin@example.com', '[\"ROLE_ADMIN\"]', '$2y$13$dR4/IW8vAxCGzBnR30aEV.MqvBIG55tDeozHwQtBn/JNMuH85E/UO', 'Bob', 'Smith', 'Lyon, France', 1, '12345-abcdef');

-- --------------------------------------------------------

--
-- Structure de la table `user_category`
--

CREATE TABLE `user_category` (
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user_category`
--

INSERT INTO `user_category` (`user_id`, `category_id`) VALUES
(1, 15),
(1, 17),
(2, 15),
(2, 17),
(2, 22);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Index pour la table `offer`
--
ALTER TABLE `offer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_29D6873E8DE820D9` (`seller_id`);

--
-- Index pour la table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rater_rated` (`rater_id`,`rated_id`),
  ADD KEY `IDX_D88926223FC1CD0A` (`rater_id`),
  ADD KEY `IDX_D88926224AB3C549` (`rated_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`);

--
-- Index pour la table `user_category`
--
ALTER TABLE `user_category`
  ADD PRIMARY KEY (`user_id`,`category_id`),
  ADD KEY `IDX_E6C1FDC1A76ED395` (`user_id`),
  ADD KEY `IDX_E6C1FDC112469DE2` (`category_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `offer`
--
ALTER TABLE `offer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `rating`
--
ALTER TABLE `rating`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `offer`
--
ALTER TABLE `offer`
  ADD CONSTRAINT `FK_29D6873E8DE820D9` FOREIGN KEY (`seller_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `FK_D88926223FC1CD0A` FOREIGN KEY (`rater_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_D88926224AB3C549` FOREIGN KEY (`rated_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `user_category`
--
ALTER TABLE `user_category`
  ADD CONSTRAINT `FK_E6C1FDC112469DE2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_E6C1FDC1A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
