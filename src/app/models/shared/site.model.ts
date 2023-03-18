import { Departement } from "./departement.model";

export class Site {
    id: number =0;
    site!: string;
    adresse!: string;
    tel!: string;
    fax!: string;
    departements: Departement[] = [];
    dateAjout: Date = new Date();
    dateModif: Date = new Date();
    userModif!: string;
    userAjout!: string;
  }