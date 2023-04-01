import { Evenement } from "./evenement.model";

export class MediaEvent{
    id: number = 0;
    pieceJointe!: string;
    imageData: string;
    evenementId: number;
    evenements: Evenement[] = [];
}