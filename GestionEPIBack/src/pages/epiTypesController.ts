// epiTypesController.ts
import express, { NextFunction, Request, Response } from "express";
import { EpiType } from "gestepiinterfaces";
import { handleGetAllEpiTypes, handleGetEpiTypeById } from "../managers/epiTypesManager";

const router = express.Router();

// Récupérer tous les types d'EPI

router.get("/", async (request: Request, response: Response<EpiType[] | string>, next: NextFunction) => {
    try {
        const epiTypes = await handleGetAllEpiTypes(request, next);
        response.status(200).json(epiTypes);
    } catch (error) {
        next(error);
    }
});

// Récupérer un type d'EPI par ID
router.get("/:id", async (request: Request, response: Response<EpiType | string>, next: NextFunction) => {
    try {
        const id = request.params.id;
        const epiType = await handleGetEpiTypeById(id, next);
        
        if (!epiType) {
            response.status(404).json("Type d'EPI non trouvé");
        } else {
            response.status(200).json(epiType);
        }
    } catch (error) {
        next(error);
    }
});

export default router;
