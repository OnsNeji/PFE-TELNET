import { Utilisateur } from "./utilisateur.model";

export class MariageNaissance{
    id: number =0;
    titre: string;
    date: Date = new Date();
    messageVoeux!: string;
    email!: string;
    userAjout!: string;
    utilisateurId: number;
    utilisateurs: Utilisateur[] = [];
}