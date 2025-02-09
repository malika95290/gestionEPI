// Types énumérés
enum EPIType {
    CORDE = 'CORDE',
    SANGLE = 'SANGLE',
    LONGE = 'LONGE',
    BAUDRIER = 'BAUDRIER',
    CASQUE = 'CASQUE',
    ASSURAGE = 'ASSURAGE',
    MOUSQUETON = 'MOUSQUETON'
  }
  
  enum EPIStatus {
    OPERATIONNEL = 'OPERATIONNEL',
    A_REPARER = 'A_REPARER',
    MIS_AU_REBUT = 'MIS_AU_REBUT'
  }
  
  enum UserRole {
    GESTIONNAIRE = 'GESTIONNAIRE',
    CORDISTE = 'CORDISTE'
  }
  
  interface User {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: UserRole;
  }
  
  // Interface pour un gestionnaire
  interface Gestionnaire extends User {
    role: UserRole.GESTIONNAIRE;
  }
  
  // Interface pour un cordiste
  interface Cordiste extends User {
    role: UserRole.CORDISTE;
  }

  // Interface principale pour un EPI
  interface EPI {
    id: string;
    interneId: string;
    numeroSerie: string;
    marque: string;
    modele: string;
    type: EPIType;
    taille?: string;
    couleur?: string;
    
    // Dates importantes
    dateAchat: Date;
    dateFabrication: Date;
    dateMiseEnService: Date;
    
    // Déterminé automatiquement basé sur la catégorie
    isTextile: boolean;
    
    // Période de contrôle en mois
    frequenceControle: number;
    
    // Relations
    controles: Controle[];
  }
  
  // Interface pour un contrôle
  interface Controle {
    id: string;
    epiId: string;
    dateControle: Date;
    status: EPIStatus;
    gestionnaireId: string;
    remarques?: string;
  }
  
  export {
    EPIType,
    EPIStatus,
    UserRole,
    User,
    Gestionnaire,
    Cordiste,
    EPI,
    Controle
  };