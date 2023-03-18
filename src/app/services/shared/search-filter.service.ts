import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/index';

@Injectable()
export class SearchFilterService {
    constructor() {
        // do nothing
    }

    periodFrom: Date = null;
    periodTo: Date = null;

    resultChanged = new Subject<void>();
    resetPeriodFrom = new Subject<void>();
    resetPeriodTo = new Subject<void>();

    pageIndex = 0;
    pageSize = 12;
    rowSpan = 1;

    showingDataLastFilter: any[] = [];
}
