//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import { epiCheck } from "gestepiinterfaces";

import {
  handleGetAllEpiChecks,
  handleGetEpiCheckById,
  handlePutEpiCheck,
  handleDeleteEpiCheck,
  handlePostEpiCheck
} from "../managers/controleManager";

const router = express.Router();
//********** Routes **********//

// READ MIDDLEWARE

// Voir tous les EPI Checks
router.get(
  "/",
  async (
    request: Request,
    response: Response<epiCheck[] | string>,
    next: NextFunction
  ) => {
    try {
      const epiChecks = await handleGetAllEpiChecks(request, next);
      response.status(200).json(epiChecks);
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
    response: Response<epiCheck[] | string>,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      response.status(200).json(await handleGetEpiCheckById(id, next));
    } catch (error) {
      next(error);
    }
  }
);

// Route de mise à jour d'un EPI Check
router.put("/", async (request: Request, response: Response<JSON>, next: NextFunction) => {
  try {
    const updatedEpiCheck = await handlePutEpiCheck(request, next);

    if (!updatedEpiCheck) return;

    response.status(200).json(updatedEpiCheck); 
  } catch (error) {
    next(error);
  }
});

// Supprimer un EPI Check par ID
router.delete("/:id", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const result = await handleDeleteEpiCheck(request, next);
    response.status(200).json(result); // Retourne le message de succès
  } catch (error) {
    next(error); // Passe l'erreur au middleware de gestion des erreurs
  }
});

// Ajouter un nouvel EPI Check
router.post("/", async (request: Request, response: Response<epiCheck | string>, next: NextFunction) => {
  try {
    const newEpiCheck = await handlePostEpiCheck(request, next);
    response.status(201).json(newEpiCheck);
  } catch (error) {
    next(error);
  }
});

export default router;
