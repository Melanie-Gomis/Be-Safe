-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : ven. 13 déc. 2024 à 14:36
-- Version du serveur : 5.7.39
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `Plantes mortelles`
--

-- --------------------------------------------------------

--
-- Structure de la table `Articles`
--

CREATE TABLE `Articles` (
  `id_art` int(11) NOT NULL,
  `nom` varchar(25) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix` float NOT NULL,
  `url_photo` varchar(25) DEFAULT NULL,
  `description` text,
  `ID_STRIPE` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Articles`
--

INSERT INTO `Articles` (`id_art`, `nom`, `quantite`, `prix`, `url_photo`, `description`, `ID_STRIPE`) VALUES
(1, 'Aconit', 802, 7.99, '../Images/Aconit.jpeg', 'Descrition : Communément appelées \"Aconit\" ou \"Casque-de-Jupiter\", ces plantes sont célèbres pour leurs fleurs en forme de casque, souvent d\'un bleu profond, violet ou blanc. <br>\r\n<br>\r\nNotation de danger : <br>\r\n— Danger de mort : 10/10 <br>\r\n— Crise cardiaque : 10/10 <br>\r\n— Hallucinogène : 0/10 <br>', 'prod_RKXIonfzXwArJs'),
(2, 'Digitale', 716, 3.99, '../Images/Digitale.jpeg', 'Description : Communément appelées \"Digitale\" ou \"Gant de Notre-Dame\", ces plantes sont connues pour leurs magnifiques fleurs en forme de cloche, généralement pourpres, roses ou blanches. <br>\r\n<br>\r\nNotation de danger : <br>\r\n— Danger de mort : 8/10 <br>\r\n— Crise cardiaque : 8/10 <br>\r\n— Hallucinogène : 0/10 <br>', 'prod_RKXLKVxqUYQpeF'),
(3, 'Datura', 0, 5.99, '../Images/Datura.jpeg', 'Description : Souvent appelées \"Datura\" ou \"Trompette des anges\", sont remarquables pour leurs grandes fleurs en forme de trompette, qui s’épanouissent en une gamme de couleurs allant du blanc au violet. <br>\r\n<br>\r\nNotation de danger : <br>\r\n— Danger de mort : 7/10 <br>\r\n— Crise cardiaque : 6/10 <br>\r\n— Hallucinogène : 9/10 <br>', 'prod_RKXN6myW2lnVOd');

-- --------------------------------------------------------

--
-- Structure de la table `Clients`
--

CREATE TABLE `Clients` (
  `id_client` int(11) NOT NULL,
  `nom` varchar(25) NOT NULL,
  `prenom` varchar(25) NOT NULL,
  `adresse` text NOT NULL,
  `numero` text NOT NULL,
  `mail` varchar(100) NOT NULL,
  `mdp` varchar(225) NOT NULL,
  `ID_STRIPE` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Clients`
--

INSERT INTO `Clients` (`id_client`, `nom`, `prenom`, `adresse`, `numero`, `mail`, `mdp`, `ID_STRIPE`) VALUES
(1, 'Dupont', 'Claire', '12 Rue de la Liberté, 75001 Paris', '0612345678', 'claire.dupont@example.com', '$2y$10$pcBszO97MjUCo/fTkTucW.6LyjjbayIwOLYzpCywF7t/c5yvCgQJ6', 'cus_RKXUxLYysPyou7'),
(2, 'Martin', 'Julien', '45 Avenue des États-Unis, 69001 Lyon', '0623456789', 'julien.martin@example.com', '$2y$10$DIIjKVTgBYKadJuFrtR6JeEQinm23fVPJkbbzP8XxANbXa42gH60u', 'cus_RKeUlrf1z3SdE2'),
(3, 'Leroy', 'Sophie', '78 Boulevard Victor Hugo, 13001 Marseille', '0634567890', 'sophie.leroy@example.com', '$2y$10$ow3FZBkENQYWXnutBmMLYuuU1A002ZZxMVpKCQqNW.g.oL87LvDLC', 'cus_RKeVIgcMjbVIvb'),
(4, 'Bernard', 'Thomas', '23 Impasse des Fleurs, 44000 Nantes', '0645678901', 'thomas.bernard@example.com', '$2y$10$bLVdgnTEScjhzhNael3om.RUe1uUyOiSkXqMMh1lbOO/r.MqMPxe.', 'cus_RKeVMawvJJzArf'),
(5, 'Moreau', 'Émilie', '9 Place de la Comédie, 31000 Toulouse', '0656789012', 'emilie.moreau@example.com', '$2y$10$aLuGJ7HiPzkDlJUQbmVlT.BdjO.g7wo6NVW1NpMJaVRRbYW6MnPxq', 'cus_RKeWH5NmSFFbmp'),
(6, 'Roux', 'Paul', '102 Rue de la Paix, 75002 Paris', '0745678901', 'paul.roux@example.com', '$2y$10$z7Z0QULeQW9BGAYJsA1ykuVvWO1L6aDowKvsAJHQBon6VMBt4uS8G', 'cus_RKeWfIoD6Hx3z9'),
(7, 'Morel', 'Alice', '12 Place de la République, 75003 Paris', '0678901234', 'alice.morel@example.com', '$2y$10$1U1twLASzYP4/7hFWN1mt.e70oJutGW3KxXLDMDj0Uew1yPK5FKM2', 'cus_RKeWIdWNo1CHzB'),
(8, 'Dumont', 'Julien', '78 Rue Victor Hugo, 69002 Lyon', '0765432109', 'julien.dumont@example.com', '$2y$10$YnridADhqudCQzW9YWCCH.50loFuoBNmDNcp0z3VVdaPQFKlryCwy', 'cus_RKujukNM6PFHxN'),
(9, 'Blanc', 'Emma', '34 Quai des Chartrons, 33000 Bordeaux', '0612345678', 'emma.blanc@exemple.com', '$2y$10$.Bwh.huwTIQR3706eSF6cOMjXuo1ctuVn.qhvpi2TGV0NSI4mxaqK', 'cus_ROH4gLhXQeETcZ'),
(10, 'Duchard', 'Louis', '37 Rue de la Tour, 34000 Montpellier', '0736153987', 'louis.duchard@exemple.com', '$2y$10$PxTh0df7hTFUIsdqHNOWme4Q/LP4UC5jVTjoLeqeY9VuOB8ESqmjq', 'cus_ROIVGhvd82qnzF');

-- --------------------------------------------------------

--
-- Structure de la table `Commandes`
--

CREATE TABLE `Commandes` (
  `num_commande` int(11) NOT NULL,
  `id_art` int(11) DEFAULT NULL,
  `id_client` int(11) DEFAULT NULL,
  `quantite` int(11) NOT NULL,
  `envoi` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Commandes`
--

INSERT INTO `Commandes` (`num_commande`, `id_art`, `id_client`, `quantite`, `envoi`) VALUES
(1, 1, 1, 3, 1),
(1, 3, 1, 3, 1),
(2, 1, 2, 1, 0),
(2, 2, 2, 2, 0),
(2, 3, 2, 1, 0),
(3, 2, 3, 2, 0),
(3, 3, 3, 1, 0),
(4, 2, 1, 2, 0),
(5, 3, 4, 5, 0),
(6, 1, 2, 1, 0),
(6, 2, 2, 4, 0),
(6, 3, 2, 2, 0),
(7, 3, 1, 1, 0),
(8, 1, 1, 3, 0),
(8, 3, 1, 3, 0),
(9, 1, 6, 2, 0),
(9, 2, 6, 2, 0),
(10, 1, 10, 13, 0),
(10, 2, 10, 7, 0),
(10, 3, 10, 928, 0);

-- --------------------------------------------------------

--
-- Structure de la table `Discussion`
--

CREATE TABLE `Discussion` (
  `id_client` int(11) NOT NULL,
  `message` varchar(256) NOT NULL,
  `timestamp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Articles`
--
ALTER TABLE `Articles`
  ADD PRIMARY KEY (`id_art`);

--
-- Index pour la table `Clients`
--
ALTER TABLE `Clients`
  ADD PRIMARY KEY (`id_client`);

--
-- Index pour la table `Commandes`
--
ALTER TABLE `Commandes`
  ADD KEY `fk_art` (`id_art`),
  ADD KEY `fk_client` (`id_client`);

--
-- Index pour la table `Discussion`
--
ALTER TABLE `Discussion`
  ADD KEY `fk_discussion_client` (`id_client`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Clients`
--
ALTER TABLE `Clients`
  MODIFY `id_client` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Commandes`
--
ALTER TABLE `Commandes`
  ADD CONSTRAINT `commandes_ibfk_1` FOREIGN KEY (`id_art`) REFERENCES `Articles` (`id_art`),
  ADD CONSTRAINT `commandes_ibfk_2` FOREIGN KEY (`id_client`) REFERENCES `Clients` (`id_client`),
  ADD CONSTRAINT `fk_art` FOREIGN KEY (`id_art`) REFERENCES `Articles` (`id_art`),
  ADD CONSTRAINT `fk_client` FOREIGN KEY (`id_client`) REFERENCES `Clients` (`id_client`);

--
-- Contraintes pour la table `Discussion`
--
ALTER TABLE `Discussion`
  ADD CONSTRAINT `fk_discussion_client` FOREIGN KEY (`id_client`) REFERENCES `Clients` (`id_client`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
