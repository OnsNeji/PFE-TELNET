import { Utilisateur } from "./utilisateur.model";

export class EmployéMois {
    id: number =0;
    date: Date = new Date();
    description!: string;
    image!: string;
    userAjout!: string;
    utilisateurId: number;
    utilisateurs: Utilisateur[] = [];
  }