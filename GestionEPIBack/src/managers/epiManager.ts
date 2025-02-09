import { NextFunction, Request } from "express";
import { EPI, EPIType } from "gestepiinterfaces";
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
): Promise<EPI[]> => {
  try {
    const filteredParams: Record<string, string | number | Date> = {};

    // Conversion des valeurs en string pour correspondre à l'interface EPI
    if (params.id) filteredParams["id"] = params.id.toString();
    if (params.interneId) filteredParams["interneId"] = params.interneId.toString();
    if (params.numeroSerie) filteredParams["numeroSerie"] = params.numeroSerie.toString();
    if (params.marque) filteredParams["marque"] = params.marque.toString().trim();
    if (params.modele) filteredParams["modele"] = params.modele.toString().trim();
    if (params.type) filteredParams["type"] = params.type.toString().trim();
    if (params.taille) filteredParams["taille"] = params.taille.toString().trim();
    if (params.couleur) filteredParams["couleur"] = params.couleur.toString().trim();
    if (params.dateAchat) filteredParams["dateAchat"] = new Date(params.dateAchat as string);
    if (params.dateFabrication) filteredParams["dateFabrication"] = new Date(params.dateFabrication as string);
    if (params.dateMiseEnService) filteredParams["dateMiseEnService"] = new Date(params.dateMiseEnService as string);
    if (params.frequenceControle) filteredParams["frequenceControle"] = Number(params.frequenceControle);

    return await epiModel.getWithFilters(filteredParams);
  } catch (error) {
    next(error);
    throw new Error("Erreur lors de la récupération des EPI par filtres");
  }
};


// Fonction de gestion de la mise à jour d'un EPI
export const handlePutEPI = async (request: Request, next: NextFunction): Promise<EPI> => {
  try {
      const {
          id,
          interneId,
          type,
          marque,
          modele,
          taille,
          couleur,
          numeroSerie,
          dateAchat,
          dateFabrication,
          dateMiseEnService,
          frequenceControle,
          isTextile,
      } = request.body;

      if (!id) {
          throw new Error("L'id de l'EPI est requis.");
      }

      // Préparer les paramètres pour la mise à jour
      const params: Record<string, string | number | Date | boolean> = { id };

      if (interneId !== undefined) params["interneId"] = interneId.toString();
      if (type !== undefined) params["type"] = type;
      if (marque !== undefined) params["marque"] = marque;
      if (modele !== undefined) params["modele"] = modele;
      if (taille !== undefined) params["taille"] = taille;
      if (couleur !== undefined) params["couleur"] = couleur;
      if (numeroSerie !== undefined) params["numeroSerie"] = numeroSerie.toString();
      if (dateAchat !== undefined) params["dateAchat"] = new Date(dateAchat);
      if (dateFabrication !== undefined) params["dateFabrication"] = new Date(dateFabrication);
      if (dateMiseEnService !== undefined) params["dateMiseEnService"] = new Date(dateMiseEnService);
      if (frequenceControle !== undefined) params["frequenceControle"] = Number(frequenceControle);
      if (isTextile !== undefined) params["isTextile"] = Boolean(isTextile); // Inclure isTextile dans la même requête

      // Mettre à jour tous les champs en une seule requête
      const results = await epiModel.update(params);

      if (results.affectedRows === 0) {
          throw new Error("Aucun EPI trouvé avec cet id.");
      }

      return await epiModel.getById(id);
  } catch (error) {
      next(error);
      throw new Error(`Erreur lors de la mise à jour de l'EPI`);
  }
};


//Suppresion d'un EPI
export const handleDeleteEPI = async (request: Request, next: NextFunction): Promise<{ message: string }> => {
  try {
    const id = request.params.id; // `id` est de type string
    if (!id) {
      throw new Error("ID de l'EPI manquant ou invalide.");
    }

    // Convertir l'ID en nombre
    const idNumber = parseInt(id, 10);
    if (isNaN(idNumber)) {
      throw new Error("ID de l'EPI invalide.");
    }

    const results = await epiModel.delete(idNumber); // Passer un nombre
    if (results.affectedRows === 0) {
      throw new Error("Erreur : aucun EPI supprimé (ID introuvable).");
    }

    return { message: `L'EPI ayant l'id : ${id} a été supprimé.` };
  } catch (error) {
    next(error);
    throw new Error("Erreur lors de la suppression de l'EPI");
  }
};


// Ajout d'un EPI
export const handlePostEPI = async (request: Request, next: NextFunction): Promise<EPI> => {
  try {
    const body = request.body;

    // Validation des champs obligatoires
    if (
      !body.interneId ||
      !body.type ||
      !body.numeroSerie ||
      !body.dateAchat ||
      !body.dateFabrication ||
      !body.dateMiseEnService ||
      !body.frequenceControle ||
      body.isTextile === undefined ||
      !body.marque // <-- Validation de `marque`
    ) {
      throw new Error("Les champs obligatoires doivent être fournis.");
    }

    // Création de l'objet EPI
    const epi: EPI = {
      id: body.id?.toString() || "",
      interneId: body.interneId.toString(),
      type: body.type,
      numeroSerie: body.numeroSerie.toString(),
      dateAchat: new Date(body.dateAchat),
      dateFabrication: new Date(body.dateFabrication),
      dateMiseEnService: new Date(body.dateMiseEnService),
      frequenceControle: Number(body.frequenceControle),
      marque: body.marque, // <-- Garanti d'être une string
      modele: body.modele || "", // Valeur par défaut
      taille: body.taille || "", // Valeur par défaut
      couleur: body.couleur || "", // Valeur par défaut
      isTextile: Boolean(body.isTextile),
      controles: [],
    };

    // Ajouter l'EPI en base de données via le modèle
    return await epiModel.addOne(epi);
  } catch (error) {
    next(error);
    throw new Error("Erreur lors de l'ajout de l'EPI");
  }
};