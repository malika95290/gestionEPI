-- Insertion des types de statut de contrôle (checkStatus)
INSERT INTO checkStatus (status) VALUES
('operationnel'),
('reparer'),
('rebut');

-- Insertion des types d'utilisateurs (userTypes)
INSERT INTO userTypes (role) VALUES
('admin'),
('manager'),
('user');

-- Insertion des utilisateurs (USERS)
INSERT INTO USERS (idUserTypes, nom, prenom, mdp) VALUES
(1, 'Dupont', 'Jean', 'password123'),  -- Admin
(2, 'Martin', 'Paul', 'password456'),  -- Manager
(3, 'Durand', 'Luc', 'password789');   -- User

-- Insertion des types d'EPI (epiTypes)
INSERT INTO epiTypes (nom) VALUES
('Casque'),
('Gants'),
('Lunettes'),
('Chaussures'),
('Vêtements');

-- Insertion des contrôles EPI (epiCheck)
INSERT INTO epiCheck (idStatus, idGestionnaire, idEPI, dateControle, remarque) VALUES
(1, 1, 1, '2025-01-15', 'Contrôle effectué avec succès'),
(2, 2, 2, '2025-01-16', 'Gants légèrement abîmés'),
(1, 3, 3, '2025-01-17', 'Lunettes en bon état'),
(3, 1, 4, '2025-01-18', 'Chaussures hors service'),
(1, 2, 5, '2025-01-19', 'Vêtements conformes');

-- Insertion des EPI (EPI)
INSERT INTO EPI (idInterne, idCheck, idTypes, marque, model, taille, couleur, numeroDeSerie, dateAchat, dateFabrication, dateMiseEnService, frequenceControle) VALUES
(1001, 1, 1, '3M', 'Peltor', 'M', 'Jaune', 123456, '2024-05-10', '2023-04-01', '2024-05-12', 'Annuel'),      -- Fréquence Annuel
(1002, 2, 2, 'Ansell', 'TouchNTuff', 'L', 'Noir', 123457, '2024-06-15', '2023-05-15', '2024-06-17', '6 mois'),     -- Fréquence 6 mois
(1003, 3, 3, 'Oakley', 'Safety Glasses', 'M', 'Transparent', 123458, '2024-07-20', '2023-06-10', '2024-07-25', '3 mois'),  -- Fréquence 3 mois
(1004, 4, 4, 'Nike', 'Air Safety', '42', 'Bleu', 123459, '2024-08-25', '2023-07-01', '2024-08-30', 'Annuel'),      -- Fréquence Annuel
(1005, 5, 5, 'Carhartt', 'Protective Suit', 'M', 'Gris', 123460, '2024-09-10', '2023-08-15', '2024-09-15', '6 mois');  -- Fréquence 6 mois
