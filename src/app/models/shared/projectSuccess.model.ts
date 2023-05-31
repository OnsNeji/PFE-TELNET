import { Departement } from "./departement.model";

export class ProjectSuccess {
    id: number =0;
    titre!: string;
    description!: string;
    pieceJointe!: string;
    userAjout!: string;
    departementId!: number;
    departements: Departement[] = [];
  }