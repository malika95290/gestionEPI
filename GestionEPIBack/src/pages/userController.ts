import express, { NextFunction, Request, Response } from "express";
import { UserRole, User } from "gestepiinterfaces";

import {
  handleGetAllUsers,
  handleGetUserById,
  handleGetUsersByFilters,
  handlePutUser,
  handleDeleteUser,
  handlePostUser,
  handleLogin
} from "../managers/userManager";

const router = express.Router();

// Voir les utilisateurs par filtre
router.get(
  "/filtres",
  async (
    request: Request,
    response: Response<User[] | string>,
    next: NextFunction
  ) => {
    try {
      const params = request.query as Record<string, string | number | undefined>;
      const results = await handleGetUsersByFilters(params, next);
      response.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }
);

// Voir tous les utilisateurs
router.get(
  "/",
  async (
    request: Request,
    response: Response<User[] | string>,
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
    response: Response<User[] | string>,
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
router.put(
  "/", 
  async (
    request: Request, 
    response: Response<User[] | string>, 
    next: NextFunction
  ) => {
    try {
      const updatedUser = await handlePutUser(request, next);
      if (!updatedUser) return;
      response.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

// Supprimer un utilisateur par ID
router.delete(
  "/:id", 
  async (
    request: Request, 
    response: Response<{ message: string } | string>, 
    next: NextFunction
  ) => {
    try {
      const result = await handleDeleteUser(request, next);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Ajouter un nouvel utilisateur
router.post(
  "/",
  async (
    request: Request,
    response: Response<User | string>,
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

// Login
router.post(
  "/login",
  async (
    request: Request,
    response: Response<{user: Partial<User>, token: string} | string>,
    next: NextFunction
  ) => {
    try {
      const result = await handleLogin(request, next);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;