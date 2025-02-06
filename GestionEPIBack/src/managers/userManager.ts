import { NextFunction, Request } from "express";
import { USERS } from "gestepiinterfaces";
import { usersModel } from "../models/userModel";

// Récupérer tous les utilisateurs
export const handleGetAllUsers = async (request: Request, next: NextFunction): Promise<USERS[]> => {
    try {
      const users = await usersModel.getAll(); // Suppose que `getAll` est une méthode du modèle
      return users;
    } catch (error) {
      next(error);
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
};

// Récupérer un utilisateur par son ID
export const handleGetUserById = async (id: string, next: NextFunction) => {
  return (await usersModel.getById(id)) satisfies USERS[];
};

export const handleGetUsersByFilters = async (
  params: Record<string, string | number | undefined>,
  next: NextFunction
) => {
  try {
    const filteredParams: Record<string, string | number> = {};

    if (params.id) filteredParams["id"] = parseInt(params.id as string, 10);
    if (params.idUserTypes) filteredParams["idUserTypes"] = parseInt(params.idUserTypes as string, 10);
    if (params.nom) filteredParams["nom"] = params.nom.toString().trim();
    if (params.prenom) filteredParams["prenom"] = params.prenom.toString().trim();
    if (params.mdp) filteredParams["mdp"] = params.mdp.toString().trim();

    return (await usersModel.getWithFilters(filteredParams)) satisfies USERS[];
  } catch (error) {
    next(error);
  }
};


// Fonction de gestion de la mise à jour d'un utilisateur
export const handlePutUser = async (request: Request, next: NextFunction) => {
  try {
    // Extraction des paramètres du corps de la requête
    const { 
      id, 
      idUserTypes, 
      nom, 
      prenom, 
      mdp 
    } = request.body;

    // Vérification que l'ID de l'utilisateur est présent
    if (!id) {
      throw new Error("L'id de l'utilisateur est requis.");
    }

    // Préparation des paramètres à mettre à jour
    const params: Record<string, string | number | Date | undefined> = { id };

    if (idUserTypes) params["idUserTypes"] = idUserTypes;
    if (nom) params["nom"] = nom;
    if (prenom) params["prenom"] = prenom;
    if (mdp) params["mdp"] = mdp;

    // Mise à jour dans la base de données
    const results = await usersModel.update(params);

    // Vérification si des lignes ont été affectées
    if (results.affectedRows === 0) {
      throw new Error("Aucun utilisateur trouvé avec cet id.");
    }

    // Retourner l'utilisateur mis à jour
    return await usersModel.getById(id);
  } catch (error) {
    next(error); // Propagation de l'erreur au middleware d'erreur
  }
};

// Suppression d'un utilisateur
export const handleDeleteUser = async (request: Request, next: NextFunction) => {
  try {
      const id = parseInt(request.params.id); // Récupérer l'ID depuis les paramètres
      if (!id) {
          throw new Error("ID de l'utilisateur manquant ou invalide.");
      }

      const results = await usersModel.delete(id);
      if (results.affectedRows === 0) {
          throw new Error("Erreur : aucun utilisateur supprimé (ID introuvable).");
      }

      return { message: `L'utilisateur ayant l'id : ${id} a été supprimé.` }; // Message de succès
  } catch (error) {
      next(error); // Passe l'erreur pour qu'elle soit gérée
  }
};

// Ajouter un nouvel utilisateur
export const handlePostUser = async (request: Request, next: NextFunction) => {
  // Vérification des champs obligatoires
  const body = request.body;
  
  if (!body.idUserTypes || !body.nom || !body.prenom || !body.mdp) {
      throw new Error("Tous les champs obligatoires doivent être fournis.");
  }
  
  // Préparation de l'objet utilisateur
  const user: USERS = {
      idUserTypes: body.idUserTypes,
      nom: body.nom,
      prenom: body.prenom,
      mdp: body.mdp,
      id: 0 // ID est généré automatiquement par la base de données
  };
  
  // Ajouter l'utilisateur en base de données via le modèle
  return await usersModel.addOne(user);
};
