import { Utilisateur } from "./utilisateur.model";

export class Connection {
    id: number = 0;
    utilisateurId: number;
    utilisateur: Utilisateur[] = [];
    SignalrId!: string;
    ConnectedAt: Date = new Date();
}