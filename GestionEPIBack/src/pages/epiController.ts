//********** Imports **********//
import express, { NextFunction, Request, Response } from "express";
import { EPI } from "gestepiinterfaces";

import {
  handleGetAllEpis,
  handleGetEpiById,
  handlePutEPI
} from "../managers/epiManager";

const router = express.Router();
//********** Routes **********//

// READ MIDDLEWARE

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
  
export default router;