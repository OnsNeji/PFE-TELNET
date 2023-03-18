import { Identifier } from '../../shared';

export class WorkFromHomeSearch {
    resourceName: string;
    selectedActivitiesIdentifiers: Identifier[];
    selectedStatusesIdentifiers: Identifier[];
    periodFrom: Date;
    periodTo: Date;
    mines: boolean;
}
