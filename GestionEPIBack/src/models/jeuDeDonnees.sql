-- Utilisation de la base de données gestionEPI
USE gestionEPI;

-- Insertion des utilisateurs
INSERT INTO Users (nom, prenom, email, password, role) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'password123', 'GESTIONNAIRE'),
('Martin', 'Alice', 'alice.martin@example.com', 'password456', 'CORDISTE'),
('Bernard', 'Luc', 'luc.bernard@example.com', 'password789', 'GESTIONNAIRE'),
('Petit', 'Sophie', 'sophie.petit@example.com', 'password101', 'CORDISTE');

-- Insertion des EPI
INSERT INTO EPI (interneId, numeroSerie, marque, modele, type, taille, couleur, dateAchat, dateFabrication, dateMiseEnService, isTextile, frequenceControle) VALUES
('EPI-001', 'SN123456', 'Petzl', 'Volta', 'CORDE', '70m', 'Rouge', '2022-01-15', '2021-12-01', '2022-02-01', TRUE, 6),
('EPI-002', 'SN654321', 'Black Diamond', 'Momentum', 'CASQUE', 'M', 'Noir', '2021-11-10', '2021-10-01', '2021-12-01', FALSE, 12),
('EPI-003', 'SN789012', 'Beal', 'Karma', 'SANGLE', '120cm', 'Bleu', '2023-03-01', '2023-02-01', '2023-03-15', TRUE, 6),
('EPI-004', 'SN345678', 'Petzl', 'Adjama', 'BAUDRIER', 'L', 'Jaune', '2022-05-20', '2022-04-01', '2022-06-01', FALSE, 12);

-- Insertion des contrôles
INSERT INTO Controles (epiId, dateControle, status, gestionnaireId, remarques) VALUES
(1, '2023-01-15', 'OPERATIONNEL', 1, 'Aucun problème détecté.'),
(2, '2023-02-20', 'A_REPARER', 1, 'Casque fissuré, besoin de réparation.'),
(3, '2023-04-01', 'OPERATIONNEL', 3, 'Sangle en bon état.'),
(4, '2023-06-15', 'MIS_AU_REBUT', 3, 'Baudrier trop usé pour être réparé.');