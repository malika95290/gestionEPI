declare enum EPIType {
    CORDE = "CORDE",
    SANGLE = "SANGLE",
    LONGE = "LONGE",
    BAUDRIER = "BAUDRIER",
    CASQUE = "CASQUE",
    ASSURAGE = "ASSURAGE",
    MOUSQUETON = "MOUSQUETON"
}
declare enum EPIStatus {
    OPERATIONNEL = "OPERATIONNEL",
    A_REPARER = "A_REPARER",
    MIS_AU_REBUT = "MIS_AU_REBUT"
}
declare enum UserRole {
    GESTIONNAIRE = "GESTIONNAIRE",
    CORDISTE = "CORDISTE"
}
interface User {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: UserRole;
}
interface Gestionnaire extends User {
    role: UserRole.GESTIONNAIRE;
}
interface Cordiste extends User {
    role: UserRole.CORDISTE;
}
interface EPI {
    id: string;
    interneId: string;
    numeroSerie: string;
    marque: string;
    modele: string;
    type: EPIType;
    taille?: string;
    couleur?: string;
    dateAchat: Date;
    dateFabrication: Date;
    dateMiseEnService: Date;
    isTextile: boolean;
    frequenceControle: number;
    controles: Controle[];
}
interface Controle {
    id: string;
    epiId: string;
    dateControle: Date;
    status: EPIStatus;
    gestionnaireId: string;
    remarques?: string;
}
export { EPIType, EPIStatus, UserRole, Gestionnaire, Cordiste, EPI, Controle };
