import { Site } from "./site.model";

export class Nouveauté {
    id: number =0;
    titre!: string;
    description!: string;
    pieceJointe!: string;
    datePublication: Date = new Date();
    sites: Site[] = [];
    userAjout!: string;
  }