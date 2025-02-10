//********** Imports **********//
import { pool } from "./bdd"; // Connexion à la base de données
import { Controle, EPI, EPIType } from "gestepiinterfaces"; // Interface de l'EPI

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
          throw new Error(`Aucun epi trouvé ayant l'id : ${id}`);
        } finally {
          if (connection) connection.release();
        }
      },

      getWithFilters: async (params: Record<string, string | number | Date>) => {
        let connection;
        try {
          connection = await pool.getConnection();
          
          let query = "SELECT * FROM EPI WHERE ";
          const values: (string | number | Date)[] = [];
          const keys = Object.keys(params);
          
          if (keys.length === 0) {
            query = "SELECT * FROM EPI";
          } else {
            keys.forEach((key, index) => {
              query += `${key} = ?`;
              values.push(params[key]);
              if (index !== keys.length - 1) query += " AND ";
            });
          }
          
          const rows = await connection.query(query, values);
          
          if (rows.length === 0) {
            throw new Error(`AUCUN EPI TROUVE - AVEC LES FILTRES DONNES ${JSON.stringify(params)}`);
          }
          
          return rows;
        } catch (error) {
          throw new Error(`AUCUN EPI TROUVE - AVEC LES FILTRES DONNES ${JSON.stringify(params)}`);
        } finally {
          if (connection) connection.release();
        }
      },
      
      update: async (params: Record<string, string | number | Date | undefined | boolean>) => {
        let connection;
        try {
            // Vérification que l'ID est bien présent dans les paramètres
            if (params["id"] && Object.keys(params).length > 1) {
                let query = "UPDATE epi SET ";
                let updates: string[] = [];
    
                // Ajout des colonnes à mettre à jour
                Object.keys(params).forEach((item) => {
                    if (item !== "id") { // Exclure l'ID de la liste des mises à jour
                        let value = params[item];
                        if (value instanceof Date) {
                            // Formater la date en YYYY-MM-DD
                            updates.push(`${item} = '${value.toISOString().split('T')[0]}'`);
                        } else if (typeof value === "boolean") {
                            // Convertir les booléens en 'true' ou 'false'
                            updates.push(`${item} = ${value ? "true" : "false"}`);
                        } else {
                            updates.push(`${item} = '${value}'`);
                        }
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
            throw new Error(`AUCUN EPI MODIFIÉ - Erreur lors de la mise à jour`);
        } finally {
            if (connection) connection.release();
        }
    },

    delete: async (id: number) => {
      let connection;
      try {
        connection = await pool.getConnection(); // Obtenir une connexion
        const rows = await pool.query(
          `DELETE FROM epi WHERE id = ?`, [id] // Utilisation des placeholders pour éviter les injections SQL
        );
    
        if (rows.affectedRows === 0) {
          throw new Error(`AUCUN EPI SUPPRIME - Peut-être que l'id n'existe pas en BDD.`);
        }
        return rows;
      } catch (error) {
        throw new Error(`AUCUN EPI SUPPRIME - Peut-être que l'id n'existe pas en BDD.`);
      } finally {
        if (connection) connection.release(); // Libérer la connexion
      }
    },

    addOne: async (epi: {
      id: string; // Type string pour correspondre à l'interface
      interneId: string; // Type string pour correspondre à l'interface
      type: EPIType;
      marque: string;
      modele: string;
      taille?: string;
      couleur?: string;
      numeroSerie: string; // Type string pour correspondre à l'interface
      dateAchat: Date;
      dateFabrication: Date;
      dateMiseEnService: Date;
      frequenceControle: number; // Type number pour correspondre à l'interface
      isTextile: boolean;
      controles: Controle[];
    }) => {
      let connection;
      try {
        // Validation des champs requis
        if (
          !epi.interneId ||
          !epi.marque ||
          !epi.modele ||
          !epi.type ||
          !epi.numeroSerie ||
          !epi.dateAchat ||
          !epi.dateFabrication ||
          !epi.dateMiseEnService ||
          epi.frequenceControle === undefined || // Validation du champ frequenceControle
          epi.isTextile === undefined // Validation du champ isTextile
        ) {
          throw new Error("AUCUN EPI AJOUTE ? Peut-être manque-t-il des données ?");
        }
    
        connection = await pool.getConnection();
    
        // Requête d'insertion des données dans la base
        const result = await connection.query(
          `INSERT INTO epi (
            interneId, type, numeroSerie, dateAchat, dateFabrication, 
            dateMiseEnService, frequenceControle, marque, modele, taille, couleur, isTextile
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            epi.interneId, // Déjà de type string
            epi.type,
            epi.numeroSerie, // Déjà de type string
            epi.dateAchat,
            epi.dateFabrication,
            epi.dateMiseEnService,
            epi.frequenceControle, // Déjà de type number
            epi.marque,
            epi.modele,
            epi.taille,
            epi.couleur,
            epi.isTextile,
          ]
        );
    
        // Vérification si l'insertion a réussi
        if (result.affectedRows === 0) {
          throw new Error("AUCUN EPI AJOUTE");
        }
    
        // Retourner l'EPI avec l'ID généré par la base de données
        return {
          ...epi,
          id: result.insertId.toString(), // Convertir l'ID en string pour correspondre à l'interface
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message || "AUCUN EPI AJOUTE ? Peut-être manque-t-il des données ?");
        } else {
          throw new Error("Une erreur inconnue est survenue.");
        }
      } finally {
        if (connection) connection.release(); // Libérer la connexion
      }
    },
  
    getUpcomingControls: async (): Promise<EPI[]> => {
      let connection;
      try {
          connection = await pool.getConnection();
          const today = new Date();
          const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 jours plus tard

          const query = `
              SELECT 
                  id, 
                  interneId, 
                  numeroSerie, 
                  marque, 
                  modele, 
                  type, 
                  taille, 
                  couleur, 
                  dateAchat, 
                  dateFabrication, 
                  dateMiseEnService, 
                  frequenceControle,
                  DATE_ADD(
                      dateMiseEnService, 
                      INTERVAL (CEIL(DATEDIFF(CURDATE(), dateMiseEnService) / (30 * frequenceControle)) * frequenceControle) MONTH
                  ) AS prochainControle
              FROM 
                  epi
              WHERE 
                  DATE_ADD(
                      dateMiseEnService, 
                      INTERVAL (CEIL(DATEDIFF(CURDATE(), dateMiseEnService) / (30 * frequenceControle)) * frequenceControle) MONTH
                  ) BETWEEN ? AND ?
          `;
          const rows = await connection.query(query, [today, nextMonth]);
          return rows;
      } catch (error) {
          throw new Error("Erreur lors de la récupération des EPIs avec des contrôles à venir.");
      } finally {
          if (connection) connection.release();
      }
  },
  
}