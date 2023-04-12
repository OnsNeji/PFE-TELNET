import { Site } from "./site.model";
import { Utilisateur } from "./utilisateur.model";

export class Departement {
    id: number = 0;
    nom!: string;
    chefD!: number;
    siteId!: number;
    utilisateurs: Utilisateur[] = [];
    site: Site[] = [];
    dateAjout: Date = new Date();
    dateModif: Date = new Date();
    userModif!: string;
    userAjout!: string;
  }