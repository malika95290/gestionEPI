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

export const handleGetEPIsByFilters = async (
  params: Record<string, string | number | Date | undefined>,
  next: NextFunction
) => {
  try {
    const filteredParams: Record<string, string | number | Date> = {};
    
    if (params.id) filteredParams["id"] = parseInt(params.id as string, 10);
    if (params.idInterne) filteredParams["idInterne"] = parseInt(params.idInterne as string, 10);
    if (params.numeroDeSerie) filteredParams["numeroDeSerie"] = parseInt(params.numeroDeSerie as string, 10);
    if (params.marque) filteredParams["marque"] = params.marque.toString().trim();
    if (params.model) filteredParams["model"] = params.model.toString().trim();
    if (params.idTypes) filteredParams["idTypes"] = parseInt(params.idTypes as string, 10);
    if (params.taille) filteredParams["taille"] = params.taille.toString().trim();
    if (params.couleur) filteredParams["couleur"] = params.couleur.toString().trim();
    if (params.dateAchat) filteredParams["dateAchat"] = new Date(params.dateAchat as string);
    if (params.dateFabrication) filteredParams["dateFabrication"] = new Date(params.dateFabrication as string);
    if (params.dateMiseEnService) filteredParams["dateMiseEnService"] = new Date(params.dateMiseEnService as string);
    if (params.frequenceControle) filteredParams["frequenceControle"] = params.frequenceControle.toString().trim();
    if (params.idCheck) filteredParams["idCheck"] = parseInt(params.idCheck as string, 10);
    
    return (await epiModel.getWithFilters(filteredParams)) satisfies EPI[];
  } catch (error) {
    next(error);
  }
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
export const handlePostEPI = async (request: Request, next: NextFunction) => {
  // Vérification des champs obligatoires
  const body = request.body;
  
  if (!body.idInterne || !body.idCheck || !body.idTypes || !body.numeroDeSerie || 
      !body.dateAchat || !body.dateFabrication || !body.dateMiseEnService || 
      !body.frequenceControle) {
      throw new Error("Tous les champs obligatoires doivent être fournis.");
  }
  
  // Préparation de l'objet EPI
  const epi: EPI = {
      idInterne: body.idInterne,
      idCheck: body.idCheck,
      idTypes: body.idTypes,
      numeroDeSerie: body.numeroDeSerie,
      dateAchat: body.dateAchat,
      dateFabrication: body.dateFabrication,
      dateMiseEnService: body.dateMiseEnService,
      frequenceControle: body.frequenceControle,
      marque: body.marque,
      model: body.model,
      taille: body.taille,
      couleur: body.couleur,
      id: 0
  };
  
  // Ajouter l'EPI en base de données via le modèle
  return await epiModel.addOne(epi);
};