Les routes : 

EPI 
- Voir tous les epis :
GET api/epis : OK
- Modifier les epis :
PUT api/epis/:id : OK
- supprimer les epis :
DELETE api/epis/:id : OK
- Ajouter un epi :
POST api/epis/:id/epi : OK

CONTROLES
- Voir les controles :
GET api/controles/:id : ok
- By id : OK
- MAJ : ok
- Supprimer les controles
DELETE api/controles/:id : ok 
- Ajouter un contrôle :
POST api/controles/:id : ok

USER :
all : OK
byId : OK
delete : OK
put (MAJ) : ok
post (add) : ok

model > manager > controller

Gestionnaire EPI et Cordiste :
- Se connecter au système
- Consulter la liste des EPI
- Consulter la liste des contrôles

Le gestionnaire peut en plus :
- Enregistrer un nouvel EPI
- Enregistrer un contrôle d'EPI
- Etre alerté des contrôles à venir

Back 
npm install --save-dev @types/jsonwebtoken : gestion des tokens

Users test :
CORDISTE : amrani kenza Kenza1234
GESTIONNAIRE : louis jean Louis1234