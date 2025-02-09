//********** Imports **********//
import { pool } from "./bdd"; // Connexion à la base de données
import { Controle, EPIStatus } from "gestepiinterfaces"; // Interface de l'EPI Check

//********** Model **********//
export const epiCheckModel = {
    getAll: async (): Promise<Controle[]> => {
      let connection;
      try {
        connection = await pool.getConnection();
        const rows = await connection.query("SELECT id, epiId, dateControle, status, gestionnaireId, remarques FROM controles"); // Vérifie la requête SQL
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

    getById: async (id: string): Promise<Controle> => {
        let connection;
        try {
          connection = await pool.getConnection();
          const rows = await connection.query(
            `SELECT id, epiId, dateControle, status, gestionnaireId, remarques FROM controles WHERE id = ?`, [id]
          );
    
          // Vérification si des résultats ont été trouvés
          if (rows.length === 0) {
            // Si aucun EPI Check n'a été trouvé, lancer une erreur avec un message spécifique
            throw new Error(`AUCUN CONTROLE D'EPI TROUVE - AVEC L'ID : ${id}`);
          }
          return rows[0];
        } catch (error) {
          throw new Error(`Aucun controle d'epi trouvé ayant l'id : ${id}`);
        } finally {
          if (connection) connection.release();
        }
      },

      getWithFilters: async (params: Record<string, string | number | Date>): Promise<Controle[]> => {
        let connection;
        try {
          connection = await pool.getConnection();
          
          let query = "SELECT id, epiId, dateControle, status, gestionnaireId, remarques FROM controles WHERE ";
          const values: (string | number | Date)[] = [];
          const keys = Object.keys(params);
          
          if (keys.length === 0) {
            query = "SELECT id, epiId, dateControle, status, gestionnaireId, remarques FROM controles";
          } else {
            keys.forEach((key, index) => {
              query += `${key} = ?`;
              values.push(params[key]);
              if (index !== keys.length - 1) query += " AND ";
            });
          }
          
          const rows = await connection.query(query, values);
          
          if (rows.length === 0) {
            throw new Error(`AUCUN CONTROLE TROUVÉ - AVEC LES FILTRES DONNÉS ${JSON.stringify(params)}`);
          }
          
          return rows;
        } catch (error) {
          throw new Error(`AUCUN CONTROLE TROUVÉ - AVEC LES FILTRES DONNÉS ${JSON.stringify(params)}`);
        } finally {
          if (connection) connection.release();
        }
      },

      update: async (params: Record<string, string | number | Date >): Promise<Controle> => {
        let connection;
        try {
            // Vérification que l'ID est bien présent dans les paramètres
            if (!params["id"] || Object.keys(params).length <= 1) {
                throw new Error("ID manquant ou paramètres insuffisants pour la mise à jour.");
            }
    
            let query = "UPDATE controles SET ";
            let updates: string[] = [];
            const values: (string | number | Date)[] = [];
    
            // Ajout des colonnes à mettre à jour
            Object.keys(params).forEach((item) => {
                if (item === "status" || item === "gestionnaireId" || item === "epiId" || 
                    item === "dateControle" || item === "remarques") {
                    
                    let value = params[item];
                    updates.push(`${item} = ?`);
                    values.push(value);
                }
            });
    
            // Vérification qu'il y a bien des champs à mettre à jour
            if (updates.length === 0) {
                throw new Error(`AUCUNE MODIFICATION - Aucun champ valide à mettre à jour.`);
            }
    
            query += updates.join(", ");
            query += ` WHERE id = ?`;
            values.push(params["id"]);
    
            // Exécution de la requête SQL
            connection = await pool.getConnection();
            const rows = await connection.query(query, values);
    
            if (rows.affectedRows === 0) {
                throw new Error(`AUCUN CONTROLE D'EPI MODIFIÉ - Peut-être que l'ID n'existe pas en BDD.`);
            }
    
            // Retourner le contrôle mis à jour
            const updatedControle = await connection.query(
                "SELECT id, epiId, dateControle, status, gestionnaireId, remarques FROM controles WHERE id = ?",
                [params["id"]]
            );
    
            return updatedControle[0];
        } catch (error) {
            throw new Error(`AUCUN CONTROLE D'EPI MODIFIÉ - Erreur lors de la mise à jour`);
        } finally {
            if (connection) connection.release();
        }
    },

    delete: async (id: string): Promise<{ affectedRows: number }> => {
      let connection;
      try {
        connection = await pool.getConnection();
        const result = await connection.query("DELETE FROM controles WHERE id = ?", [id]);
    
        // Retourner un objet contenant affectedRows
        return { affectedRows: result.affectedRows };
      } catch (error) {
        throw new Error(`Erreur lors de la suppression du contrôle d'EPI : ${error instanceof Error ? error.message : "Erreur inconnue"}`);
      } finally {
        if (connection) connection.release();
      }
    },

    addOne: async (epiCheckData: {
      epiId: string;
      dateControle: Date;
      status: EPIStatus;
      gestionnaireId: string;
      remarques?: string;
    }): Promise<Controle> => {
      let connection;
      try {
          // Validation des champs requis
          if (!epiCheckData.epiId || !epiCheckData.dateControle || !epiCheckData.status || !epiCheckData.gestionnaireId) {
              throw new Error("AUCUN CONTROLE D'EPI AJOUTE ? Peut-être manque-t-il des données ?");
          }
  
          connection = await pool.getConnection();
  
          // Requête d'insertion des données dans la base
          const result = await connection.query(
              `INSERT INTO controleS (epiId, dateControle, status, gestionnaireId, remarques) 
              VALUES (?, ?, ?, ?, ?);`,
              [
                  epiCheckData.epiId, epiCheckData.dateControle, epiCheckData.status, epiCheckData.gestionnaireId, epiCheckData.remarques
              ] // Utilisation des paramètres pour éviter les injections SQL
          );
  
          // Vérification si l'insertion a réussi
          if (result.affectedRows === 0) {
              throw new Error("AUCUN CONTROLE D'EPI AJOUTE");
          }
          
          return {
            ...epiCheckData,
            id: result.insertId.toString(),
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