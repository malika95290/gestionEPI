export enum UserTypes{
    ADMIN = 'admin',
    MANAGER = 'manager', 
    USER = 'user'
}

export enum CheckStatus {
    OPERATIONNEL = 'operationnel',
    REPARER = 'reparer',
    REBUT = 'rebut'
}

export interface EpiType{
    id:number,
    nom:string
}

export interface userTypes{
    id:number,
    role:UserTypes
}

export interface USERS{
    id:number,
    idUserTypes:number,
    nom:string,
    prenom:string,
    mdp:string
}

export interface EPI{
    id:number,
    idInterne:number,
    idCheck:number,
    idTypes:number,
    marque?:string,
    model?:string,
    taille?:string,
    couleur?:string,
    numeroDeSerie:number,
    dateAchat:Date,
    dateFabrication:Date,
    dateMiseEnService:Date,
    frequenceControle:string
}

export interface epiCheck{
    id:number,
    idStatus:number,
    idGestionnaire:number,
    idEPI:number,
    dateControle:Date,
    remarque:string
}

export interface checkStatus{
    id:number
    status: CheckStatus
}


