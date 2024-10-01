-- Création de la base de données gestionEPI
CREATE DATABASE gestionEPI;

-- Utilisation de la base de données gestionEPI
USE gestionEPI;

-- Création de la table epiTypes
CREATE TABLE epiTypes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(10) NOT NULL
);

-- Création de la table userTypes
CREATE TABLE userTypes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role VARCHAR(10) NOT NULL
);

-- Création de la table USERS
CREATE TABLE USERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idUserTypes INT,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    mdp VARCHAR(10),
    FOREIGN KEY (idUserTypes) REFERENCES userTypes(id)
);

-- Création de la table EPI
CREATE TABLE EPI (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idInterne INT,
    idCheck INT,
    idTypes INT,
    marque VARCHAR(100),
    model VARCHAR(100),
    taille VARCHAR(100),
    couleur VARCHAR(100),
    numeroDeSerie INT,
    dateAchat DATE,
    dateFabrication DATE,
    dateMiseEnService DATE,
    frequenceControle VARCHAR(100),
    FOREIGN KEY (idCheck) REFERENCES epiCheck(id),
    FOREIGN KEY (idTypes) REFERENCES epiTypes(id)
);

-- Création de la table epiCheck
CREATE TABLE epiCheck (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idStatus INT,
    idGestionnaire INT,
    idEPI INT,
    dateControle DATE,
    remarque VARCHAR(100),
    FOREIGN KEY (idStatus) REFERENCES checkStatus(id),
    FOREIGN KEY (idGestionnaire) REFERENCES USERS(id),
    FOREIGN KEY (idEPI) REFERENCES EPI(id)
);

-- Création de la table checkStatus
CREATE TABLE checkStatus (
    id INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(10)
);
