import { Projet } from "./projet.model";

export class ProjectSuccess {
    id: number =0;
    titre!: string;
    description!: string;
    pieceJointe!: string;
    userAjout!: string;
    projetId!: number;
    projets: Projet[] = [];
  }