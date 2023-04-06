import { Nouveauté } from "./nouveauté.model";

export class Mariage extends Nouveauté{
    date: Date = new Date();
    constructor(){
        super();
    }
  }