import { NextFunction, Request } from "express";
import { EPI, epiCheck } from "gestepiinterfaces";
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
  
