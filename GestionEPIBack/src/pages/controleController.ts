//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import { EPIStatus, Controle } from "gestepiinterfaces";

import {
  handleGetAllEpiChecks,
  handleGetEpiCheckById,
  handleGetEpiChecksByFilters,
  handlePutEpiCheck,
  handleDeleteEpiCheck,
  handlePostEpiCheck
} from "../managers/controleManager";

const router = express.Router();
//********** Routes **********//

// READ MIDDLEWARE

// Voir les filtres

router.get(
  "/filtres",
  async (
    request: Request,
    response: Response<Controle[] | string>, // Utilisez Controle[] au lieu de epiCheck[]
    next: NextFunction
  ) => {
    try {
      const params = request.query as Record<string, string | number | Date | undefined>;
      const results = await handleGetEpiChecksByFilters(params, next);
      response.status(200).json(results);
    } catch (error) {
      next(error);
    }
  }
);

// Voir tous les EPI Checks
router.get(
  "/",
  async (
    request: Request,
    response: Response<Controle[] | string>, // Utilisez Controle[] au lieu de epiCheck[]
    next: NextFunction
  ) => {
    try {
      const controles = await handleGetAllEpiChecks(request, next);
      response.status(200).json(controles);
    } catch (error) {
      next(error);
    }
  }
);

// Voir un EPI Check par ID
router.get(
  "/:id",
  async (
    request: Request,
    response: Response<Controle | string>, // Utilisez Controle au lieu de epiCheck[]
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const controle = await handleGetEpiCheckById(id, next);
      response.status(200).json(controle);
    } catch (error) {
      next(error);
    }
  }
);


// Route de mise à jour d'un EPI Check
router.put(
  "/",
  async (
    request: Request,
    response: Response<Controle | string>, // Utilisez Controle au lieu de JSON
    next: NextFunction
  ) => {
    try {
      const updatedControle = await handlePutEpiCheck(request, next);

      if (!updatedControle) {
        throw new Error("Aucun contrôle mis à jour.");
      }

      response.status(200).json(updatedControle);
    } catch (error) {
      next(error);
    }
  }
);

// Supprimer un EPI Check par ID
router.delete(
  "/:id",
  async (
    request: Request,
    response: Response<{ message: string }>, // Retourne un message de succès
    next: NextFunction
  ) => {
    try {
      const result = await handleDeleteEpiCheck(request, next);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Ajouter un nouvel EPI Check
router.post(
  "/",
  async (
    request: Request,
    response: Response<Controle | string>, // Utilisez Controle au lieu de epiCheck
    next: NextFunction
  ) => {
    try {
      const newControle = await handlePostEpiCheck(request, next);
      response.status(201).json(newControle);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
