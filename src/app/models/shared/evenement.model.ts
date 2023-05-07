import { MediaEvent } from "./mediaEvent.model";

export class Evenement {
    id: number = 0;
    titre!: string;
    description!: string;
    userAjout!: string;
    categorie!: string;
    dateEvent: Date = new Date();
    mediaEvents: MediaEvent[] = [];
}