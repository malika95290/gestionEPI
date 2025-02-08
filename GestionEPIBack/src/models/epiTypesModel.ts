//********** Imports **********//
import { pool } from "./bdd"; // Connexion à la base de données
import { EPI } from "gestepiinterfaces"; // Interface de l'EPI

//********** Model **********//
export const epiTypesModel = {
    getAll: async (): Promise<EPI[]> => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await connection.query("SELECT * FROM epiTypes"); // Vérifie la requête SQL
            if (rows.length === 0) {
                throw new Error("Aucun type d'EPI trouvé.");
            }
            return rows;
        } catch (error) {
            throw new Error("Erreur lors de la récupération des types d'EPI.");
        } finally {
            if (connection) connection.release();
        }
    },

    getById: async (id: string) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const rows = await connection.query(
                `SELECT * FROM epiTypes WHERE id = ?`, [id]
            );
            if (rows.length === 0) {
                throw new Error(`AUCUN TYPE D'EPI TROUVE - AVEC L'ID : ${id}`);
            }
            return rows;
        } catch (error) {
            throw new Error(`Aucun type d'EPI trouvé ayant l'id : ${id}`);
        } finally {
            if (connection) connection.release();
        }
    },
};
