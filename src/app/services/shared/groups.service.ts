import { Injectable } from '@angular/core';
import { Group } from 'app/models/shared';

@Injectable()
export class GroupsService {
    _allGroup: any[];

    constructor() {
        // do nothing
    }

    addGroups(data: any[], groupByColumns: string[]): any[] {
        const rootGroup = new Group();
        rootGroup.expanded = true;
        return this.getSublevel(data, 0, groupByColumns, rootGroup);
    }

    getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
        if (level >= groupByColumns.length) {
            return data;
        }
        const groups = this.uniqueBy(
            data.map(
                row => {
                    const result = new Group();
                    result.level = level + 1;
                    result.parent = parent;
                    for (let i = 0; i <= level; i++) {
                        result[groupByColumns[i]] = row[groupByColumns[i]];
                    }
                    return result;
                }
            ),
            JSON.stringify);

        const currentColumn = groupByColumns[level];
        let subGroups = [];
        groups.forEach(group => {
            const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
            group.totalCounts = rowsInGroup.length;
            const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
            subGroup.unshift(group);
            subGroups = subGroups.concat(subGroup);
        });
        this._allGroup = subGroups;
        return subGroups;
    }

    isGroup(item): boolean {
        return item.level;
    }

    uniqueBy(a, key) {
        const seen = {};
        return a.filter((item) => {
            const k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
    }
}
