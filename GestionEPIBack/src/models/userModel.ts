//********** Imports **********//
import { pool } from "./bdd"; // Connexion à la base de données
import { USERS } from "gestepiinterfaces"; // Interface des utilisateurs

//********** Model **********//
export const usersModel = {
    getAll: async (): Promise<USERS[]> => {
      let connection;
      try {
        connection = await pool.getConnection();
        const rows = await connection.query("SELECT * FROM users"); // Vérifie la requête SQL
        console.log(rows)
        if (rows.length === 0) {
          throw new Error("Aucun utilisateur trouvé.");
        }
        return rows;
      } catch (error) {
        throw new Error("Erreur lors de la récupération des utilisateurs.");
      } finally {
        if (connection) connection.release();
      }
    },

    getById: async (id: string) => {
        let connection;
        try {
          connection = await pool.getConnection();
          const rows = await pool.query(
            `SELECT * FROM users WHERE id = "${id}"`
          );
    
          // Vérification si des résultats ont été trouvés
          if (rows.length === 0) {
            throw new Error(`AUCUN UTILISATEUR TROUVE - AVEC L'ID : ${id}`);
          }
          return rows;
        } catch (error) {
          throw new Error(`Aucun utilisateur trouvé ayant l'id : ${id}`);
        } finally {
          if (connection) connection.release();
        }
      },

      getWithFilters: async (params: Record<string, string | number>) => {
        let connection;
        try {
          connection = await pool.getConnection();
    
          let query = "SELECT * FROM USERS WHERE ";
          const values: (string | number)[] = [];
          const keys = Object.keys(params);
    
          if (keys.length === 0) {
            query = "SELECT * FROM USERS";
          } else {
            keys.forEach((key, index) => {
              query += `${key} = ?`;
              values.push(params[key]);
              if (index !== keys.length - 1) query += " AND ";
            });
          }
    
          const rows = await connection.query(query, values);
    
          if (rows.length === 0) {
            throw new Error(`AUCUN UTILISATEUR TROUVÉ - FILTRES: ${JSON.stringify(params)}`);
          }
    
          return rows;
        } catch (error) {
          throw new Error(`AUCUN UTILISATEUR TROUVÉ - FILTRES: ${JSON.stringify(params)}`);
        } finally {
          if (connection) connection.release();
        }
      },

      update: async (params: Record<string, string | number | Date | undefined>) => {
        let connection;
        try {
            // Vérification que l'ID est bien présent dans les paramètres
            if (params["id"] && Object.keys(params).length > 1) {
                let query = "UPDATE users SET ";
                let updates: string[] = [];
    
                // Ajout des colonnes à mettre à jour
                Object.keys(params).forEach((item) => {
                    if (item === "idUserTypes" || item === "nom" || item === "prenom" || item === "mdp") {
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
                    throw new Error(`AUCUN UTILISATEUR MODIFIÉ - Peut-être que l'ID n'existe pas en BDD.`);
                }
    
                return rows;
            }
        } catch (error) {
            throw new Error(`AUCUN UTILISATEUR MODIFIÉ - Erreur lors de la mise à jour.`);
        } finally {
            if (connection) connection.release();
        }
    },

    delete: async (id: number) => {
      let connection;
      try {
        connection = await pool.getConnection(); // Obtenir une connexion
        const rows = await pool.query(
          `DELETE FROM users WHERE id = ?`, [id] // Utilisation des placeholders pour éviter les injections SQL
        );
    
        if (rows.affectedRows === 0) {
          throw new Error(`AUCUN UTILISATEUR SUPPRIMÉ - Peut-être que l'id n'existe pas en BDD.`);
        }
        return rows;
      } catch (error) {
        throw new Error(`AUCUN UTILISATEUR SUPPRIMÉ - Peut-être que l'id n'existe pas en BDD.`);
      } finally {
        if (connection) connection.release(); // Libérer la connexion
      }
    },

    addOne: async (user: {
      idUserTypes: number;
      nom: string;
      prenom: string;
      mdp: string;
  }) => {
      let connection;
      try {
          // Validation des champs requis
          if (!user.idUserTypes || !user.nom || !user.prenom || !user.mdp) {
              throw new Error("AUCUN UTILISATEUR AJOUTE ? Peut-être manque-t-il des données ?");
          }
  
          connection = await pool.getConnection();
  
          // Requête d'insertion des données dans la base
          const result = await connection.query(
              `INSERT INTO users (idUserTypes, nom, prenom, mdp) 
              VALUES (?, ?, ?, ?);`,
              [
                  user.idUserTypes, user.nom, user.prenom, user.mdp
              ] // Utilisation des paramètres pour éviter les injections SQL
          );
  
          // Vérification si l'insertion a réussi
          if (result.affectedRows === 0) {
              throw new Error("AUCUN UTILISATEUR AJOUTE");
          }
          
          return {
            ...user,
            id: Number(result.insertId),
        };
  
      } catch (error) {
          if (error instanceof Error) {
              throw new Error(error.message || "AUCUN UTILISATEUR AJOUTE ? Peut-être manque-t-il des données ?");
          } else {
              throw new Error("Une erreur inconnue est survenue.");
          }
      } finally {
          if (connection) connection.release(); // Libérer la connexion
      }
  },
}
