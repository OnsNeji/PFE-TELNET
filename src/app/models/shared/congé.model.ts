import { Utilisateur } from "./utilisateur.model";

export class Congé {
    id: number =0;
    type: string;
    description: string;
    date: Date = new Date();
    dateDebut: Date = new Date();
    duree: number; 
    status: string; 
    justificatif: string;
    document: string;
    utilisateurId: number;
    utilisateurs: Utilisateur[] = [];
}