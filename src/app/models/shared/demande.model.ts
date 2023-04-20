import { Utilisateur } from "./utilisateur.model";


export class Demande {
    id: number =0;
    titre: string;
    description: string;
    date: Date = new Date();
    status: string; 
    document: string;
    utilisateurId: number;
    utilisateurs: Utilisateur[] = [];
}