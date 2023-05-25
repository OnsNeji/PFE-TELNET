import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FilterPipe'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {
        if (!items || !value) {
          return items;
        }
    
        return items.filter(item => item[field] === value);
      }
}
