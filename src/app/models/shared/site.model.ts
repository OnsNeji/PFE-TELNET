import { Departement } from "./departement.model";
import { Nouveauté } from "./nouveauté.model";

export class Site {
    id: number =0;
    site!: string;
    adresse!: string;
    tel!: string;
    fax!: string;
    departements: Departement[] = [];
    nouveautés: Nouveauté[] = [];
    dateAjout: Date = new Date();
    dateModif: Date = new Date();
    userModif!: string;
    userAjout!: string;
  }