export class Convention {
    id: number = 0;
    titre!: string;
    logo!: string;
    dateDebut: Date = new Date();
    dateFin: Date = new Date();
    description!: string;
    status!: string;
    pieceJointe: string;
    userAjout!: string;
}
