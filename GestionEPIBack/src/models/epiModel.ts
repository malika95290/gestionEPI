//********** Imports **********//
import { pool } from "./bdd"; // Connexion à la base de données
import { EPI } from "gestepiinterfaces"; // Interface de l'EPI

//********** Model **********//
export const epiModel = {
    getAll: async (): Promise<EPI[]> => {
      let connection;
      try {
        connection = await pool.getConnection();
        const rows = await connection.query("SELECT * FROM epi"); // Vérifie la requête SQL
        console.log(rows)
        if (rows.length === 0) {
          throw new Error("Aucun EPI trouvé.");
        }
        return rows;
      } catch (error) {
        throw new Error("Erreur lors de la récupération des EPI.");
      } finally {
        if (connection) connection.release();
      }
    },

    getById: async (id: string) => {
        let connection;
        try {
          connection = await pool.getConnection();
          const rows = await pool.query(
            `select * from epi where id = "${id}"`
          );
    
          // Vérification si des résultats ont été trouvés
          if (rows.length === 0) {
            // Si aucun avion n'a été trouvé, lancer une erreur avec un message spécifique
            throw new Error(`AUCUN EPI TROUVE - AVEC L'ID : ${id}`);
          }
          return rows;
        } catch (error) {
          throw new Error(`Aucun avion trouvé ayant l'id : ${id}`);
        } finally {
          if (connection) connection.release();
        }
      },
    }