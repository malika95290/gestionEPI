// epiTypesManager.ts
import { NextFunction, Request } from "express";
import { epiTypesModel } from "../models/epiTypesModel";
import { EpiType } from "gestepiinterfaces"; // Correction du type

// Récupérer tous les types d'EPI
export const handleGetAllEpiTypes = async (request: Request, next: NextFunction): Promise<EpiType[]> => {
    try {
        const epiList = await epiTypesModel.getAll(); // Assurez-vous que cette fonction retourne bien des EpiType[]
        
        return epiList.map((epi: any) => ({
            id: epi.id,
            nom: epi.nom, // Vérifiez que "nom" existe bien dans votre base de données
        }));
    } catch (error) {
        next(error);
        throw new Error("Erreur lors de la récupération des types d'EPI");
    }
};

// Récupérer un type d'EPI par ID
export const handleGetEpiTypeById = async (id: string, next: NextFunction): Promise<EpiType | null> => {
    try {
        const epiType = await epiTypesModel.getById(id);
        if (!epiType) {
            throw new Error("Type d'EPI non trouvé");
        }
        return epiType;
    } catch (error) {
        next(error);
        return null;
    }
};
