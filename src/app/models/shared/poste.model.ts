import { Site } from "./site.model";
import { Utilisateur } from "./utilisateur.model";

export class Poste {
    id: number=0;
    numéro!: number;
    utilisateurId!: number;
    utilisateur!: Utilisateur;
    dateAjout: Date = new Date();
    dateModif: Date = new Date();
    userModif!: string;
    userAjout!: string;
    etage!: string;
    siteId!: number;
    sites: Site[] = [];
}