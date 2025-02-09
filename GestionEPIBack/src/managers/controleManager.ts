import { NextFunction, Request } from "express";
import { EPIStatus, Controle } from "gestepiinterfaces";
import { epiCheckModel } from "../models/controleModel";


// Récupérer tous les EPI Checks
export const handleGetAllEpiChecks = async (request: Request, next: NextFunction): Promise<Controle[]> => {
  try {
    const controles = await epiCheckModel.getAll();
    return controles;
  } catch (error) {
    next(error);
    throw new Error("Erreur lors de la récupération des contrôles d'EPI.");
  }
};

// Avec son id
export const handleGetEpiCheckById = async (id: string, next: NextFunction): Promise<Controle> => {
  try {
    const controle = await epiCheckModel.getById(id);
    return controle;
  } catch (error) {
    next(error);
    throw new Error(`Erreur lors de la récupération du contrôle d'EPI avec l'ID : ${id}`);
  }
};

export const handleGetEpiChecksByFilters = async (
  params: Record<string, string | number | Date | undefined>,
  next: NextFunction
): Promise<Controle[]> => {
  try {
    const filteredParams: Record<string, string | number | Date> = {};

    // Mappage des paramètres pour correspondre à l'interface Controle
    if (params.id) filteredParams["id"] = params.id;
    if (params.epiId) filteredParams["epiId"] = params.epiId;
    if (params.status) filteredParams["status"] = params.status;
    if (params.gestionnaireId) filteredParams["gestionnaireId"] = params.gestionnaireId;
    if (params.dateControle) filteredParams["dateControle"] = new Date(params.dateControle as string);
    if (params.remarques) filteredParams["remarques"] = params.remarques.toString().trim();

    const controles = await epiCheckModel.getWithFilters(filteredParams);
    return controles;
  } catch (error) {
    next(error);
    throw new Error("Erreur lors de la récupération des contrôles d'EPI avec les filtres donnés.");
  }
};

// Fonction de gestion de la mise à jour d'un EPI Check
export const handlePutEpiCheck = async (request: Request, next: NextFunction): Promise<Controle> => {
  try {
    const { id, epiId, status, gestionnaireId, dateControle, remarques } = request.body;

    // Vérification que l'ID est présent
    if (!id) {
      throw new Error("L'ID du contrôle d'EPI est requis.");
    }

    // Préparation des paramètres à mettre à jour
    const params: Record<string, string | number | Date > = { id };

    if (epiId) params["epiId"] = epiId;
    if (status) params["status"] = status;
    if (gestionnaireId) params["gestionnaireId"] = gestionnaireId;
    if (dateControle) params["dateControle"] = new Date(dateControle);
    if (remarques) params["remarques"] = remarques;

    // Mise à jour dans la base de données
    const updatedControle = await epiCheckModel.update(params);

    return updatedControle;
  } catch (error) {
    next(error);
    throw new Error("Erreur lors de la mise à jour du contrôle d'EPI.");
  }
};

// Suppression d'un EPI Check
export const handleDeleteEpiCheck = async (request: Request, next: NextFunction): Promise<{ message: string }> => {
  try {
    const id = request.params.id; // ou parseInt si l'ID est un nombre
    if (!id) {
      throw new Error("ID du contrôle d'EPI manquant ou invalide.");
    }

    const results = await epiCheckModel.delete(id);
    if (results.affectedRows === 0) {
      throw new Error("Erreur : aucun contrôle d'EPI supprimé (ID introuvable).");
    }

    return { message: `Le contrôle d'EPI ayant l'ID : ${id} a été supprimé.` };
  } catch (error) {
    next(error);
    throw new Error("Erreur lors de la suppression du contrôle d'EPI.");
  }
};


// Ajouter un nouvel EPI Check
export const handlePostEpiCheck = async (request: Request, next: NextFunction): Promise<Controle> => {
  try {
    const { epiId, status, gestionnaireId, dateControle, remarques } = request.body;

    // Vérification des champs obligatoires
    if (!epiId || !status || !gestionnaireId || !dateControle) {
      throw new Error("Tous les champs obligatoires doivent être fournis.");
    }

    // Préparation de l'objet Controle
    const controleData: Controle = {
      id: "0", // ou 0 si l'ID est un nombre
      epiId,
      status,
      gestionnaireId,
      dateControle: new Date(dateControle),
      remarques,
    };

    // Ajout du contrôle d'EPI en base de données
    const newControle = await epiCheckModel.addOne(controleData);
    return newControle;
  } catch (error) {
    next(error);
    throw new Error("Erreur lors de l'ajout du contrôle d'EPI.");
  }
};
