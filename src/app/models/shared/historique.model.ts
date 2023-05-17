import { Demande } from "./demande.model";

export class Historique {
    id: number =0;
    etat: string; 
    dateEtat: Date = new Date();
    demandeId: number;
    demandes: Demande[] = [];
}