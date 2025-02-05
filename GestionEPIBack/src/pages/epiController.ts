//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import { EPI } from "gestepiinterfaces";

import {
  handleGetAllEpis,
  handleGetEpiById,
  handleGetEPIsByFilters,
  handlePutEPI,
  handleDeleteEPI,
  handlePostEPI
} from "../managers/epiManager";

const router = express.Router();
//********** Routes **********//

// READ MIDDLEWARE

// Voir avec les filtres 

router.get(
    "/filtres",
    async (
      request: Request,
      response: Response<EPI[] | string>,
      next: NextFunction
    ) => {
      try {
        const params = request.query as Record<string, string | number | Date | undefined>;
        const results = await handleGetEPIsByFilters(params, next);
        response.status(200).json(results);
      } catch (error) {
        next(error);
      }
    }
  );

// Voir tous les epis
router.get(
  "/",
  async (
      request: Request,
      response: Response<EPI[] | string>,
      next: NextFunction
  ) => {
      try {
          const epis = await handleGetAllEpis(request, next);
          response.status(200).json(epis);
      } catch (error) {
      next(error);
      }
  }
  );

router.get(
"/:immatriculation",
async (
    request: Request,
    response: Response<EPI[] | string>,
    next: NextFunction
) => {
    try {
    const immat = request.params.immatriculation
    response.status(200).json(await handleGetEpiById(immat, next));
    } catch (error) {
    next(error);
    }
}
);

// Route de mise à jour d'un EPI
router.put("/", async (request: Request, response: Response<JSON>, next: NextFunction) => {
    try {
      const updatedEPI = await handlePutEPI(request, next); 
  
      if (!updatedEPI) return;
  
      response.status(200).json(updatedEPI); 
    } catch (error) {
      next(error);
    }
  });
  
// Supprimer un EPI par ID
router.delete("/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const result = await handleDeleteEPI(request, next);
        response.status(200).json(result); // Retourne le message de succès
    } catch (error) {
        next(error); // Passe l'erreur au middleware de gestion des erreurs
    }
});

router.post("/",
    async (
        request: Request,
        response: Response<EPI | string>,
        next: NextFunction
    ) => {
        try {
            const newEPI = await handlePostEPI(request,next);
            response.status(201).json(newEPI);
        } catch (error) {
            next(error);
        }
    }
);


export default router;