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
    destinataire: string;
    dateSortie: Date = new Date();
    utilisateurId: number;
    utilisateurs: Utilisateur[] = [];
    adminId: number;
    admins: Utilisateur[] = [];
    type: string; 
    dateDebut: Date = new Date();
    dateFin: Date = new Date();
    etudiant1: string; 
    etudiant2: string; 
    sujet: string; 
    fac: string; 
    debutS: Date = new Date();
    finS: Date = new Date();
    historiques: Demande[] = [];
}