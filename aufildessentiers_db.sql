-- phpMyAdmin SQL Dump
-- version 4.9.6
-- https://www.phpmyadmin.net/
--
-- Hôte : v044qa.myd.infomaniak.com
-- Généré le :  lun. 20 oct. 2025 à 17:10
-- Version du serveur :  10.11.14-MariaDB-deb11-log
-- Version de PHP :  7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `v044qa_aufildessentiers_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `blog_articles`
--

CREATE TABLE `blog_articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `image` varchar(512) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `author` varchar(150) DEFAULT 'Équipe',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `blog_articles`
--

INSERT INTO `blog_articles` (`id`, `title`, `slug`, `excerpt`, `image`, `content`, `author`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'Bienvenue sur le blog', 'bienvenue-sur-le-blog', 'Premiers pas : notre blog va partager des récits de randonnées, conseils et actualités locales.', '/images/articles/article-1.jpg', 'Premiers pas : notre blog va partager des récits de randonnées, conseils et actualités locales.\r\nCe nouvel espace a été imaginé comme un point de rencontre pour tous les amoureux de nature, qu’ils soient marcheurs du dimanche ou aventuriers chevronnés. Ici, vous trouverez de l’inspiration pour vos prochaines sorties, des retours d’expérience sur les plus beaux sentiers, des recommandations d’équipement testées sur le terrain et des portraits de passionnés qui vivent la randonnée au quotidien.\r\n\r\nNotre objectif est simple : donner envie de sortir, d’explorer, de ralentir et de se reconnecter à ce qui compte vraiment. Nous partagerons aussi des idées de randonnées accessibles, des itinéraires familiaux, des focus sur la faune et la flore, ainsi que des initiatives locales en lien avec l’écotourisme.\r\nChaque article est une invitation à prendre le temps, à observer, à ressentir. Le blog évoluera avec vous — vos retours, vos récits et vos photos rendront cet espace vivant et authentique. Alors, bienvenue dans cette aventure collective, au fil des sentiers et au rythme de vos pas.', 'Léa', '2024-09-01 10:00:00', '2025-10-02 22:40:25', '2025-10-20 13:32:22'),
(2, 'Comment préparer une randonnée d\'une journée', 'preparer-une-randonnee-1-journee', 'Checklist et conseils pour une randonnée d\'une journée réussie.', '/images/articles/article-2.jpg', 'Checklist et conseils pour une randonnée d\'une journée réussie.\r\nPartir marcher, c’est simple en apparence… mais une bonne préparation transforme une sortie ordinaire en une expérience vraiment agréable. Avant de chausser vos bottines, prenez le temps de planifier votre itinéraire, d’étudier la météo et de préparer votre sac intelligemment.\r\nUn équipement adapté — chaussures confortables, vêtements respirants, gourde, encas énergétiques — vous permettra d’éviter les petits désagréments et de profiter pleinement de la journée.\r\n\r\nNous vous proposons une checklist complète pour ne rien oublier : carte, trousse de secours, protection solaire, batterie portable… autant de détails qui font toute la différence une fois sur les sentiers. Pensez aussi à évaluer la durée et le dénivelé pour ne pas sous-estimer votre parcours.\r\nUne fois prêt, laissez-vous guider par vos pas : admirez les paysages, écoutez les sons de la forêt, respirez profondément. Une randonnée bien préparée, c’est l’assurance de revenir le soir avec le sourire, fatigué juste ce qu’il faut et l’esprit apaisé.', 'Mathis', '2024-09-10 09:00:00', '2025-10-02 22:40:25', '2025-10-20 13:32:12'),
(3, 'Rencontrer des personnes lors des événements', 'rencontrer-personnes-evenements', 'Nos événements sont pensés pour favoriser les échanges et le contact humain.', '/images/articles/article-3.jpg', 'Nos événements sont pensés pour favoriser les échanges et le contact humain.\r\nQue vous veniez seul ou accompagné, ces rencontres sont l’occasion parfaite pour partager votre passion de la marche et de la nature dans une ambiance conviviale. Chaque sortie rassemble des randonneurs venus d’horizons variés : certains découvrent la région pour la première fois, d’autres connaissent chaque sentier par cœur — mais tous ont en commun le plaisir simple d’avancer ensemble.\r\n\r\nAu fil des kilomètres, les discussions se nouent naturellement : on échange des conseils d’équipement, des anecdotes de voyage, des bonnes adresses locales… et souvent, ces moments débouchent sur de vraies amitiés. Les pauses pique-nique deviennent des instants de partage, les paysages se savourent à plusieurs, et chaque étape est une petite aventure humaine.\r\nRejoignez nos prochains événements pour découvrir des itinéraires inspirants, respirer l’air pur et rencontrer une communauté qui marche dans le même esprit que vous : bienveillance, découverte et plaisir de la nature.', 'Camille', '2024-09-20 14:00:00', '2025-10-02 22:40:25', '2025-10-20 13:32:02');

-- --------------------------------------------------------

--
-- Structure de la table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `created_at`, `is_read`) VALUES
(1, 'Mehdi Korichi', 'mehdikorichi@hotmail.com', 'test contact', 'test contact', '2025-10-03 19:15:38', 1),
(2, 'Mehdi Korichi', 'mehdikorichi@hotmail.com', 'test contact', 'test', '2025-10-04 02:41:51', 1),
(3, 'Mehdi Korichi', 'mehdikorichi@hotmail.com', 'test', 'test', '2025-10-19 03:16:08', 1);

-- --------------------------------------------------------

--
-- Structure de la table `email_verification_tokens`
--

CREATE TABLE `email_verification_tokens` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `email_verification_tokens`
--

INSERT INTO `email_verification_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(21, 37, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM3LCJlbWFpbCI6Im1laGRpa29yaWNoaUBob3RtYWlsLmNvbSIsInR5cGUiOiJwYXNzd29yZF9yZXNldCIsImlhdCI6MTc2MDg5NDg2OCwiZXhwIjoxNzYwODk4NDY4fQ.mWlTKUx15uhEQGQgVwt1fW33A6ru5l8kFI7izCZEcuk', '2025-10-19 20:27:48', '2025-10-19 19:27:48'),
(23, 39, 'c3060881-038b-450e-8f9c-a528d40076b0', '2025-10-20 18:03:40', '2025-10-19 20:03:40'),
(26, 42, '85c85d06-177d-4ed0-9c8c-157978e52f19', '2025-10-21 00:43:35', '2025-10-20 02:43:35');

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `location` varchar(255) NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'default.jpg',
  `status` enum('Ouvert','Fermé','Complet','Annulé') DEFAULT 'Ouvert',
  `participants` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `events`
--

INSERT INTO `events` (`id`, `title`, `date`, `location`, `lat`, `lng`, `image`, `status`, `participants`, `description`) VALUES
(5, 'Randonnée dans la Forêt de Soignes', '2026-02-15', 'Forêt de Soignes, Bruxelles', 50.7896, 4.4105, '/images/events/event-5.jpg', 'Ouvert', 12, 'Découvrez la magnifique Forêt de Soignes lors d\'une randonnée de 8km. Parfait pour les débutants et les familles. Nous explorerons les sentiers forestiers et observerons la faune locale.'),
(6, 'Yoga au Parc de Bruxelles', '2025-02-18', 'Parc de Bruxelles, Bruxelles', 50.8466, 4.3656, '/images/events/event-6.jpg', 'Ouvert', 8, 'Séance de yoga en plein air dans le magnifique Parc de Bruxelles. Apportez votre tapis et venez vous détendre au cœur de la nature urbaine. Tous niveaux acceptés.'),
(7, 'Marche sur la Plage de Knokke', '2026-02-22', 'Plage de Knokke-Heist', 51.3456, 3.2878, '/images/events/event-7.jpg', 'Ouvert', 25, 'Marche matinale sur la magnifique plage de Knokke-Heist. Nous profiterons de l\'air marin et de la vue sur la mer du Nord. Distance: 6km le long du littoral.'),
(8, 'Randonnée dans les Ardennes', '2026-02-25', 'Parc Naturel des Hautes Fagnes', 50.52, 6.1, '/images/events/event-8.jpg', 'Ouvert', 40, 'Randonnée de 12km dans le Parc Naturel des Hautes Fagnes. Paysages magnifiques, tourbières et forêts d\'épicéas. Niveau intermédiaire requis. Prévoir des chaussures de randonnée.'),
(9, 'Permaculture au Jardin Botanique', '2026-02-28', 'Jardin Botanique de Meise', 50.93, 4.33, '/images/events/event-9.jpg', 'Ouvert', 10, 'Atelier de permaculture dans le magnifique Jardin Botanique de Meise. Apprenez les techniques de jardinage durable et découvrez les plantes comestibles. Matériel fourni.'),
(10, 'Observation des Étoiles à Ciel Noc', '2026-03-02', 'Observatoire de Ciel Noc, Namur', 50.4669, 4.8677, '/images/events/event-10.jpg', 'Ouvert', 6, 'Soirée d\'observation des étoiles à l\'Observatoire de Ciel Noc. Découvrez les constellations et les planètes avec nos télescopes. Parfait pour les amateurs d\'astronomie.');

-- --------------------------------------------------------

--
-- Structure de la table `event_registrations`
--

CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `event_id` int(11) NOT NULL,
  `status` enum('Inscrit','Annulé','Présent') DEFAULT 'Inscrit',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `event_registrations`
--

INSERT INTO `event_registrations` (`id`, `user_id`, `event_id`, `status`, `created_at`, `updated_at`) VALUES
(16, 37, 5, 'Présent', '2025-10-04 09:57:19', '2025-10-04 09:57:26'),
(17, 37, 6, 'Présent', '2025-10-08 14:45:12', '2025-10-08 14:45:23'),
(18, 37, 7, 'Présent', '2025-10-08 15:07:38', '2025-10-08 15:07:45'),
(19, 37, 10, 'Inscrit', '2025-10-18 23:45:44', '2025-10-18 23:45:44'),
(20, 40, 10, 'Inscrit', '2025-10-19 19:23:39', '2025-10-19 19:23:39'),
(21, 40, 5, 'Inscrit', '2025-10-19 19:23:49', '2025-10-19 19:23:49'),
(22, 40, 6, 'Inscrit', '2025-10-19 19:23:59', '2025-10-19 19:23:59'),
(23, 40, 9, 'Inscrit', '2025-10-19 19:24:06', '2025-10-19 19:24:06'),
(24, 40, 7, 'Inscrit', '2025-10-19 19:24:15', '2025-10-19 19:24:15');

-- --------------------------------------------------------

--
-- Structure de la table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `event_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `images`
--

INSERT INTO `images` (`id`, `name`, `event_id`, `created_at`) VALUES
(1, '67f3fb660de27.jpg', 1, '2025-04-07 18:20:54'),
(2, '67f3fb8fb1c7b.jpg', 2, '2025-04-07 18:21:35'),
(3, '67f3fb9773807.jpg', 3, '2025-04-07 18:21:43'),
(4, '67f3fbad35e9c.jpg', 4, '2025-04-07 18:22:05');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `remember_token` varchar(255) DEFAULT NULL,
  `status` enum('pending','active','banned') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `created_at`, `updated_at`, `remember_token`, `status`) VALUES
(37, 'Mehdi Korichi', 'mehdikorichi@hotmail.com', '2025-10-04 00:47:01', '$2a$12$phW8E5jYqEBkHntWuA5YM.BZjfml1eBtCCGkQuQFHG/.EPjcXbznm', 'admin', '2025-10-04 00:46:31', '2025-10-19 16:48:38', NULL, 'active'),
(38, 'Mehdi Korichi', 'korichimehdi95@gmail.com', '2025-10-19 17:50:22', '$2a$12$h2xIQavF80GmPyNYQOAazO2oz1IrsbFPw8IQ9MCH51RjAhYXHaIiq', 'user', '2025-10-19 17:50:06', '2025-10-19 17:50:22', NULL, 'active'),
(39, 'Isabelle', 'isanandrin@hotmail.com', NULL, '$2a$12$l83I74OutGLc4l0fMw5CmuxlBTxnk/H08gjrOv8whmnwDPf7qNVUe', 'user', '2025-10-19 18:03:40', '2025-10-19 18:03:40', NULL, 'pending'),
(40, 'Maxime De meulemeester', 'maximedemeule@hotmail.fr', '2025-10-19 19:16:49', '$2a$12$392bcD9y63w7..2vXHGqnuK6S39KGjT3y85l7Z6wcPtZsOv7vlvqa', 'user', '2025-10-19 19:16:20', '2025-10-19 19:16:49', NULL, 'active'),
(41, 'coffinet', 'vittysanyt@gmail.com', '2025-10-20 00:39:38', '$2a$12$OPgi0BfrzEOr.iG3drv4yuOWkKIhcQCVt2N/.OxgYC9xtYnmNX4E2', 'user', '2025-10-20 00:39:19', '2025-10-20 00:39:38', NULL, 'active');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `blog_articles`
--
ALTER TABLE `blog_articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_published_at` (`published_at`);

--
-- Index pour la table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `created_at` (`created_at`);

--
-- Index pour la table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_token` (`token`),
  ADD KEY `idx_email_verification_tokens_user_id` (`user_id`);

--
-- Index pour la table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_registration` (`user_id`,`event_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_event` (`event_id`);

--
-- Index pour la table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `blog_articles`
--
ALTER TABLE `blog_articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `fk_event_registration` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_registration` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
