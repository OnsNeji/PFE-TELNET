import { Departement } from "./departement.model";
import { Poste } from "./poste.model";

export class Utilisateur {
    id: number;
    nom!: string;
    prenom!: string;
    matricule!: string;
    dateEmbauche: Date = new Date();
    email!: string;
    motDePasse!: string;
    tel!: string;
    dateNaissance: Date = new Date();
    role!: string;
    token!: string;
    resetPasswordToken!: string;
    resetPasswordExpiry: Date = new Date();
    image!: string;
    salaire!: number;
    poste: Poste[] = [];
    departementId!: number;
    departement: Departement[] = [];
    supprimé: Boolean = false;
    dateAjout: Date = new Date();
    dateModif: Date = new Date();
    userModif!: string;
    userAjout!: string;

}
