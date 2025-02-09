import { NextFunction, Request } from "express";
import { UserRole, User } from "gestepiinterfaces";
import { UserRoleModel } from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// Helper function to validate and transform user data
const validateAndTransformUser = (data: any): User => {
  if (!data.nom || !data.prenom || !data.email || !data.password || !data.role) {
    throw new Error("All required fields must be provided");
  }
  
  if (data.role !== 'GESTIONNAIRE' && data.role !== 'CORDISTE') {
    throw new Error("Invalid role specified");
  }

  return {
    id: data.id?.toString() || "",
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    password: data.password,
    role: data.role as UserRole
  };
};

// Rest of the functions remain the same
export const handleGetAllUsers = async (request: Request, next: NextFunction): Promise<User[]> => {
    try {
      const users = await UserRoleModel.getAll();
      return users;
    } catch (error) {
      next(error);
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
};

export const handleGetUserById = async (id: string, next: NextFunction): Promise<User[]> => {
  return await UserRoleModel.getById(id);
};

export const handleGetUsersByFilters = async (
  params: Record<string, string | number | undefined>,
  next: NextFunction
): Promise<User[]> => {
  try {
    const filteredParams: Record<string, string | number> = {};

    if (params.id) filteredParams["id"] = params.id.toString();
    if (params.nom) filteredParams["nom"] = params.nom.toString().trim();
    if (params.prenom) filteredParams["prenom"] = params.prenom.toString().trim();
    if (params.email) filteredParams["email"] = params.email.toString().trim();
    if (params.password) filteredParams["password"] = params.password.toString().trim();
    if (params.role) filteredParams["role"] = params.role.toString().trim();

    return await UserRoleModel.getWithFilters(filteredParams);
  } catch (error) {
    next(error);
    throw error;
  }
};

export const handlePostUser = async (request: Request, next: NextFunction) => {
  try {
    // Vérification des champs obligatoires
    const body = request.body;
    
    if (!body.nom || !body.prenom || !body.email || !body.password || !body.role) {
        throw new Error("Tous les champs obligatoires doivent être fournis.");
    }

    // Hachage du mot de passe
    const saltRounds = 10;  // Nombre de tours pour le hachage
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    
    // Préparation de l'objet utilisateur avec mot de passe haché
    const user = {
        id: body.id?.toString() || "",  // Conversion explicite en string
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        password: hashedPassword,  // Utilisation du mot de passe haché
        role: body.role as UserRole
    };
    
    // Ajouter l'utilisateur en base de données via le modèle
    const result = await UserRoleModel.addOne(user);
    return {
        ...result,
        id: result.id.toString() // Assure que l'ID retourné est bien une string
    };
  } catch (error) {
    next(error);
    throw error;
  }
};

export const handlePutUser = async (request: Request, next: NextFunction): Promise<User[]> => {
  try {
    const { id, ...updateData } = request.body;

    if (!id) {
      throw new Error("User ID is required");
    }

    const params: Record<string, string | number | Date | undefined> = { 
      id,
      ...updateData
    };

    await UserRoleModel.update(params);
    return await UserRoleModel.getById(id);
  } catch (error) {
    next(error);
    throw error;
  }
};

export const handleDeleteUser = async (request: Request, next: NextFunction) => {
  try {
    const id = parseInt(request.params.id);
    if (!id) {
      throw new Error("Invalid user ID");
    }

    const results = await UserRoleModel.delete(id);
    return { message: `User with ID ${id} has been deleted` };
  } catch (error) {
    next(error);
    throw error;
  }
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const validateLoginCredentials = (data: any) => {
  if (!data.nom || !data.prenom || !data.password) {
    throw new Error("Nom, prénom et mot de passe sont requis pour la connexion");
  }
  
  return {
    nom: data.nom,
    prenom: data.prenom,
    password: data.password
  };
};

export const handleLogin = async (request: Request, next: NextFunction) => {
  try {
    // Use specific login validation instead of full user validation
    const credentials = validateLoginCredentials(request.body);
    
    let user;
    try {
      user = await UserRoleModel.findByCredentials(
        credentials.nom,
        credentials.prenom,
        credentials.password
      );
    } catch (error) {
      throw new Error('Utilisateur non trouvé');
    }

    if (!user) {
      throw new Error('Identifiants invalides');
    }

    try {
      const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect');
      }
    } catch (error) {
      throw new Error('Erreur lors de la vérification du mot de passe');
    }

    const token = jwt.sign(
      { 
        id: user.id,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      },
      token
    };
  } catch (error) {
    // Log the specific error for debugging
    console.error('Login error:', error);
    // Throw a more specific error message
    throw error instanceof Error ? error : new Error('Une erreur est survenue lors de la connexion');
  }
};