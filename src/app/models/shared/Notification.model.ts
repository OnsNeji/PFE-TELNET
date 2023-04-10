import { Convention } from "./convention.model";
import { EmployéMois } from "./employeMois.model";
import { Evenement } from "./evenement.model";
import { Nouveauté } from "./nouveauté.model";

export class Notification {
    id: number = 0;
    message!: string;
    date: Date = new Date();
    userAjout!: string;
    conventionId: number;
    conventions: Convention[] = [];
    nouveautéId: number;
    nouveautés: Nouveauté[] = [];
    EvenementId: number;
    evenements: Evenement[] = [];
    EmployéMoisId: number;
    employésMois: EmployéMois[] = [];
}