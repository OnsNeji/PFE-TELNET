import { Evenement } from "./evenement.model";

export class MediaEvent{
    id: number = 0;
    pieceJointe!: string;
    evenementId: number;
    evenements: Evenement[] = [];
}