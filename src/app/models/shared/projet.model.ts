import { ProjectSuccess } from "./projectSuccess.model";

export class Projet {
    id: number =0;
    nom!: string;
    description!: string;
    budget!: number;
    projectSuccesses: ProjectSuccess[] = [];
    dateDébut: Date = new Date();
    dateFin: Date = new Date();
    userAjout!: string;
  }