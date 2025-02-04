//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import { USERS } from "gestepiinterfaces";

import {
  handleGetAllUsers,
  handleGetUserById,
  handlePutUser,
  handleDeleteUser,
  handlePostUser
} from "../managers/userManager";

const router = express.Router();
//********** Routes **********//

// READ MIDDLEWARE

// Voir tous les utilisateurs
router.get(
  "/",
  async (
    request: Request,
    response: Response<USERS[] | string>,
    next: NextFunction
  ) => {
    try {
      const users = await handleGetAllUsers(request, next);
      response.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

// Récupérer un utilisateur par ID
router.get(
  "/:id",
  async (
    request: Request,
    response: Response<USERS[] | string>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      response.status(200).json(await handleGetUserById(id, next));
    } catch (error) {
      next(error);
    }
  }
);

// Route de mise à jour d'un utilisateur
router.put("/", async (request: Request, response: Response<JSON>, next: NextFunction) => {
    try {
      const updatedUser = await handlePutUser(request, next); 
  
      if (!updatedUser) return;
  
      response.status(200).json(updatedUser); 
    } catch (error) {
      next(error);
    }
  });

// Supprimer un utilisateur par ID
router.delete("/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const result = await handleDeleteUser(request, next);
        response.status(200).json(result); // Retourne le message de succès
    } catch (error) {
        next(error); // Passe l'erreur au middleware de gestion des erreurs
    }
});

// Ajouter un nouvel utilisateur
router.post("/",
  async (
    request: Request,
    response: Response<USERS | string>,
    next: NextFunction
  ) => {
    try {
      const newUser = await handlePostUser(request, next);
      response.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
