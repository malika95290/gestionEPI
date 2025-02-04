import { NextFunction, Request } from "express";
import { epiCheck } from "gestepiinterfaces";
import { epiCheckModel } from "../models/controleModel";

// Récupérer tous les EPI Checks
export const handleGetAllEpiChecks = async (request: Request, next: NextFunction): Promise<epiCheck[]> => {
    try {
      const epiChecks = await epiCheckModel.getAll(); // Suppose que `getAll` est une méthode du modèle
      return epiChecks;
    } catch (error) {
      next(error);
      throw new Error("Erreur lors de la récupération des EPI Checks");
    }
  };

// Récupérer un EPI Check par son ID
export const handleGetEpiCheckById = async (id: string, next: NextFunction) => {
  return (await epiCheckModel.getById(id)) satisfies epiCheck[];
};

// Fonction de gestion de la mise à jour d'un EPI Check
export const handlePutEpiCheck = async (request: Request, next: NextFunction) => {
  try {
    // Extraction des paramètres du corps de la requête
    const { 
      id, 
      idStatus, 
      idGestionnaire, 
      idEPI, 
      dateControle, 
      remarque
    } = request.body;

    // Vérification que l'ID de l'EPI Check est présent
    if (!id) {
      throw new Error("L'id de l'EPI Check est requis.");
    }

    // Préparation des paramètres à mettre à jour
    const params: Record<string, string | number | Date | undefined> = { id };

    if (idStatus) params["idStatus"] = idStatus;
    if (idGestionnaire) params["idGestionnaire"] = idGestionnaire;
    if (idEPI) params["idEPI"] = idEPI;
    if (dateControle) params["dateControle"] = dateControle;
    if (remarque) params["remarque"] = remarque;

    // Mise à jour dans la base de données
    const results = await epiCheckModel.update(params);

    // Vérification si des lignes ont été affectées
    if (results.affectedRows === 0) {
      throw new Error("Aucun EPI Check trouvé avec cet id.");
    }

    // Retourner l'EPI Check mis à jour
    return await epiCheckModel.getById(id);
  } catch (error) {
    next(error); // Propagation de l'erreur au middleware d'erreur
  }
};

// Suppression d'un EPI Check
export const handleDeleteEpiCheck = async (request: Request, next: NextFunction) => {
  try {
      const id = parseInt(request.params.id); // Récupérer l'ID depuis les paramètres
      if (!id) {
          throw new Error("ID de l'EPI Check manquant ou invalide.");
      }

      const results = await epiCheckModel.delete(id);
      if (results.affectedRows === 0) {
          throw new Error("Erreur : aucun EPI Check supprimé (ID introuvable).");
      }

      return { message: `L'EPI Check ayant l'id : ${id} a été supprimé.` }; // Message de succès
  } catch (error) {
      next(error); // Passe l'erreur pour qu'elle soit gérée
  }
};

// Ajouter un nouvel EPI Check
export const handlePostEpiCheck = async (request: Request, next: NextFunction) => {
  // Vérification des champs obligatoires
  const body = request.body;

  if (!body.idStatus || !body.idGestionnaire || !body.idEPI || !body.dateControle || !body.remarque) {
      throw new Error("Tous les champs obligatoires doivent être fournis.");
  }

  // Préparation de l'objet EPI Check
  const epiCheckData: epiCheck = {
      idStatus: body.idStatus,
      idGestionnaire: body.idGestionnaire,
      idEPI: body.idEPI,
      dateControle: body.dateControle,
      remarque: body.remarque,
      id: 0
  };

  // Ajouter l'EPI Check en base de données via le modèle
  return await epiCheckModel.addOne(epiCheckData);
};
