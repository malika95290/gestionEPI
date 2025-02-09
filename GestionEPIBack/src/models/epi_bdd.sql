-- Supprimer la base de données si elle existe déjà
DROP DATABASE IF EXISTS gestionEPI;

-- Création de la base de données gestionEPI
CREATE DATABASE gestionEPI;

-- Utilisation de la base de données gestionEPI
USE gestionEPI;

-- Table pour les utilisateurs (User)
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('GESTIONNAIRE', 'CORDISTE') NOT NULL
);

-- Table pour les EPI
CREATE TABLE EPI (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    interneId VARCHAR(255) NOT NULL,
    numeroSerie VARCHAR(255) NOT NULL,
    marque VARCHAR(255) NOT NULL,
    modele VARCHAR(255) NOT NULL,
    type ENUM('CORDE', 'SANGLE', 'LONGE', 'BAUDRIER', 'CASQUE', 'ASSURAGE', 'MOUSQUETON') NOT NULL,
    taille VARCHAR(50),
    couleur VARCHAR(50),
    dateAchat DATE NOT NULL,
    dateFabrication DATE NOT NULL,
    dateMiseEnService DATE NOT NULL,
    isTextile BOOLEAN NOT NULL,
    frequenceControle INT NOT NULL
);

-- Table pour les contrôles
CREATE TABLE Controles (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    epiId INT NOT NULL,
    dateControle DATE NOT NULL,
    status ENUM('OPERATIONNEL', 'A_REPARER', 'MIS_AU_REBUT') NOT NULL,
    gestionnaireId INT NOT NULL,
    remarques TEXT,
    FOREIGN KEY (epiId) REFERENCES EPI(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (gestionnaireId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);