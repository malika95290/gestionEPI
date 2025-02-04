import { NextFunction, Request } from "express";
import { EPI, epiCheck } from "gestepiinterfaces";
import { epiModel } from "../models/epiModel";


// Récupérer tous les EPI
export const handleGetAllEpis = async (request: Request, next: NextFunction): Promise<EPI[]> => {
    try {
      const epis = await epiModel.getAll(); // Suppose que `getAll` est une méthode du modèle
      return epis;
    } catch (error) {
      next(error);
      throw new Error("Erreur lors de la récupération des EPI");
    }
  };
  
export const handleGetEpiById = async (id:string, next: NextFunction) => {
  return (await epiModel.getById(id)) satisfies EPI[];
};
  
// Fonction de gestion de la mise à jour d'un EPI
export const handlePutEPI = async (request: Request, next: NextFunction) => {
  try {
    // Extraction des paramètres du corps de la requête
    const { 
      id, 
      idInterne, 
      idCheck, 
      idTypes, 
      marque, 
      model, 
      taille, 
      couleur, 
      numeroDeSerie, 
      dateAchat, 
      dateFabrication, 
      dateMiseEnService, 
      frequenceControle 
    } = request.body;

    // Vérification que l'ID de l'EPI est présent
    if (!id) {
      throw new Error("L'id de l'EPI est requis.");
    }

    // Préparation des paramètres à mettre à jour
    const params: Record<string, string | number | Date | undefined> = { id };

    if (idInterne) params["idInterne"] = idInterne;
    if (idCheck) params["idCheck"] = idCheck;
    if (idTypes) params["idTypes"] = idTypes;
    if (marque) params["marque"] = marque;
    if (model) params["model"] = model;
    if (taille) params["taille"] = taille;
    if (couleur) params["couleur"] = couleur;
    if (numeroDeSerie) params["numeroDeSerie"] = numeroDeSerie;
    if (dateAchat) params["dateAchat"] = dateAchat;
    if (dateFabrication) params["dateFabrication"] = dateFabrication;
    if (dateMiseEnService) params["dateMiseEnService"] = dateMiseEnService;
    if (frequenceControle) params["frequenceControle"] = frequenceControle;

    // Mise à jour dans la base de données
    const results = await epiModel.update(params);

    // Vérification si des lignes ont été affectées
    if (results.affectedRows === 0) {
      throw new Error("Aucun EPI trouvé avec cet id.");
    }

    // Retourner l'EPI mis à jour
    return await epiModel.getById(id);
  } catch (error) {
    next(error); // Propagation de l'erreur au middleware d'erreur
  }
};

//Suppresion d'un EPI
export const handleDeleteEPI = async (request: Request, next: NextFunction) => {
  try {
      const id = parseInt(request.params.id); // Récupérer l'ID depuis les paramètres
      if (!id) {
          throw new Error("ID de l'EPI manquant ou invalide.");
      }

      const results = await epiModel.delete(id);
      if (results.affectedRows === 0) {
          throw new Error("Erreur : aucun EPI supprimé (ID introuvable).");
      }

      return { message: `L'EPI ayant l'id : ${id} a été supprimé.` }; // Message de succès
  } catch (error) {
      next(error); // Passe l'erreur pour qu'elle soit gérée
  }
};

