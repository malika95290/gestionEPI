//********** Imports **********//
import { pool } from "./bdd"; // Connexion à la base de données
import { epiCheck } from "gestepiinterfaces"; // Interface de l'EPI Check

//********** Model **********//
export const epiCheckModel = {
    getAll: async (): Promise<epiCheck[]> => {
      let connection;
      try {
        connection = await pool.getConnection();
        const rows = await connection.query("SELECT * FROM epiCheck"); // Vérifie la requête SQL
        console.log(rows);
        if (rows.length === 0) {
          throw new Error("Aucun contrôle d'EPI trouvé.");
        }
        return rows;
      } catch (error) {
        throw new Error("Erreur lors de la récupération des contrôles d'EPI.");
      } finally {
        if (connection) connection.release();
      }
    },

    getById: async (id: string) => {
        let connection;
        try {
          connection = await pool.getConnection();
          const rows = await connection.query(
            `SELECT * FROM epiCheck WHERE id = "${id}"`
          );
    
          // Vérification si des résultats ont été trouvés
          if (rows.length === 0) {
            // Si aucun EPI Check n'a été trouvé, lancer une erreur avec un message spécifique
            throw new Error(`AUCUN CONTROLE D'EPI TROUVE - AVEC L'ID : ${id}`);
          }
          return rows;
        } catch (error) {
          throw new Error(`Aucun controle d'epi trouvé ayant l'id : ${id}`);
        } finally {
          if (connection) connection.release();
        }
      },

      update: async (params: Record<string, string | number | Date | undefined>) => {
        let connection;
        try {
            // Vérification que l'ID est bien présent dans les paramètres
            if (params["id"] && Object.keys(params).length > 1) {
                let query = "UPDATE epiCheck SET ";
                let updates: string[] = [];
    
                // Ajout des colonnes à mettre à jour
                Object.keys(params).forEach((item) => {
                    if (item === "idStatus" || item === "idGestionnaire" || item === "idEPI" || 
                        item === "dateControle" || item === "remarque") {
                        
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
                    throw new Error(`AUCUN CONTROLE D'EPI MODIFIÉ - Peut-être que l'ID n'existe pas en BDD.`);
                }
    
                return rows;
            }
        } catch (error) {
            throw new Error(`AUCUN CONTROLE D'EPI MODIFIÉ - Erreur lors de la mise à jour.`);
        } finally {
            if (connection) connection.release();
        }
    },

    delete: async (id: number) => {
      let connection;
      try {
        connection = await pool.getConnection(); // Obtenir une connexion
        const rows = await connection.query(
          `DELETE FROM epiCheck WHERE id = ?`, [id] // Utilisation des placeholders pour éviter les injections SQL
        );
    
        if (rows.affectedRows === 0) {
          throw new Error(`AUCUN CONTROLE D'EPI SUPPRIME - Peut-être que l'id n'existe pas en BDD.`);
        }
        return rows;
      } catch (error) {
        throw new Error(`AUCUN CONTROLE D'EPI SUPPRIME - Peut-être que l'id n'existe pas en BDD.`);
      } finally {
        if (connection) connection.release(); // Libérer la connexion
      }
    },

    addOne: async (epiCheckData: {
      idStatus: number;
      idGestionnaire: number;
      idEPI: number;
      dateControle: Date;
      remarque: string;
    }) => {
      let connection;
      try {
          // Validation des champs requis
          if (!epiCheckData.idStatus || !epiCheckData.idGestionnaire || !epiCheckData.idEPI || !epiCheckData.dateControle || !epiCheckData.remarque) {
              throw new Error("AUCUN CONTROLE D'EPI AJOUTE ? Peut-être manque-t-il des données ?");
          }
  
          connection = await pool.getConnection();
  
          // Requête d'insertion des données dans la base
          const result = await connection.query(
              `INSERT INTO epiCheck (idStatus, idGestionnaire, idEPI, dateControle, remarque) 
              VALUES (?, ?, ?, ?, ?);`,
              [
                  epiCheckData.idStatus, epiCheckData.idGestionnaire, epiCheckData.idEPI, epiCheckData.dateControle, epiCheckData.remarque
              ] // Utilisation des paramètres pour éviter les injections SQL
          );
  
          // Vérification si l'insertion a réussi
          if (result.affectedRows === 0) {
              throw new Error("AUCUN CONTROLE D'EPI AJOUTE");
          }
          
          return {
            ...epiCheckData,
            id: Number(result.insertId),
        };
  
      } catch (error) {
          if (error instanceof Error) {
              throw new Error(error.message || "AUCUN CONTROLE D'EPI AJOUTE ? Peut-être manque-t-il des données ?");
          } else {
              throw new Error("Une erreur inconnue est survenue.");
          }
      } finally {
          if (connection) connection.release(); // Libérer la connexion
      }
  },
}
