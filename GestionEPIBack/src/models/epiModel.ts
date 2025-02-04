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

      update: async (params: Record<string, string | number | Date | undefined>) => {
        let connection;
        try {
            // Vérification que l'ID est bien présent dans les paramètres
            if (params["id"] && Object.keys(params).length > 1) {
                let query = "UPDATE epi SET ";
                let updates: string[] = [];
    
                // Ajout des colonnes à mettre à jour
                Object.keys(params).forEach((item) => {
                    if (item === "idInterne" || item === "idCheck" || item === "idTypes" || item === "marque" || 
                        item === "model" || item === "taille" || item === "couleur" || item === "numeroDeSerie" || 
                        item === "dateAchat" || item === "dateFabrication" || item === "dateMiseEnService" || item === "frequenceControle") {
                        
                        let value = params[item];
                        updates.push(`${item} = "${value}"`);
                    }
                });
    
                // Vérification qu'il y a bien des champs à mettre à jour
                if (updates.length === 0) {
                    throw new Error(`AUCUNE MODIFICATION - Aucun champ valide à mettre à jour.`);
                }
    
                query += updates.join(", ");
                query += ` WHERE id = ${params["id"]}`;
    
                // Exécution de la requête SQL
                connection = await pool.getConnection();
                const rows = await connection.query(query);
    
                if (rows.affectedRows === 0) {
                    throw new Error(`AUCUN EPI MODIFIÉ - Peut-être que l'ID n'existe pas en BDD.`);
                }
    
                return rows;
            }
        } catch (error) {
            throw new Error(`AUCUN EPI MODIFIÉ - Erreur lors de la mise à jour.`);
        } finally {
            if (connection) connection.release();
        }
    }
    
    
    
}