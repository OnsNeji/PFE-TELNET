import { Utilisateur } from "./utilisateur.model";


export class Demande {
    id: number =0;
    titre: string;
    description: string;
    priorite: string;
    date: Date = new Date();
    status: string; 
    document: string;
    mois: Date = new Date();
    motif: string; 
    destinataire: string;
    dateSortie: Date = new Date();
    utilisateurId: number;
    utilisateurs: Utilisateur[] = [];
    adminId: number;
    admins: Utilisateur[] = [];
}