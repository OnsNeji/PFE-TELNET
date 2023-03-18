import { Pipe, PipeTransform } from '@angular/core';
import { SearchFilterService } from 'app/services/shared';

@Pipe({
  name: 'paginator'
})
export class PaginatorPipe implements PipeTransform {

  constructor(public searchFilterService: SearchFilterService) { }

  startIndex: number;
  endIndex: number;
  filterValue: string;

  transform(entity: any[], pageIndex: number, pageSize: number): any {
    this.startIndex = (pageIndex * (pageSize * this.searchFilterService.rowSpan)) + 1;
    this.endIndex = (pageSize * this.searchFilterService.rowSpan) * (pageIndex + 1);
    if (!(entity === null || entity === undefined)) {
      this.searchFilterService.showingDataLastFilter = entity.slice(this.startIndex - 1, this.endIndex);
      this.searchFilterService.resultChanged.next();
      return entity.slice(this.startIndex - 1, this.endIndex);
    }
  }

}
