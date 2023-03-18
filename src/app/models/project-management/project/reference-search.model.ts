import { Identifier } from '../../shared';

export class ReferenceSearch {
    referenceCode: string;
    title: string;
    selectedStatusesIdentifiers: Identifier[];
    selectedTypesIdentifiers: Identifier[];
    selectedActivitiesIdentifiers: Identifier[];
    periodFrom: Date;
    periodTo: Date;
}
