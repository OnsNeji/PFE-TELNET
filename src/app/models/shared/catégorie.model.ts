import { Convention } from "./convention.model";

export class Catégorie {
    id: number = 0;
    nom!: string;
    conventions: Convention[] = [];
}