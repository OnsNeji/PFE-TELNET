export class SortService {
    public compare(a, b, isAsc, isNumber) {
        if (a === null || a === undefined || a === '0001-01-01T00:00:00' || a === ' ') {
            return isAsc ? 1 : -1;
        }
        if (b === null || b === undefined || b === '0001-01-01T00:00:00' || b === ' ') {
            return !isAsc ? 1 : -1;
        }
        if ((a === null && b === null) || (a === undefined && b === undefined)) {
            return 0;
        }
        if (isNumber) {
            return this.compareNumbers(a, b, isAsc);
        } else {
            return this.compareStrings(a, b, isAsc);
        }
    }
    compareNumbers(a, b, isAsc) {
        return ((parseFloat(a) - parseFloat(b)) * (isAsc ? 1 : -1));
    }
    compareStrings(a, b, isAsc) {
        if (a.toString().toUpperCase() < b.toString().toUpperCase()) {
            return -1 * (isAsc ? 1 : -1);
        } else if (a.toString().toUpperCase() > b.toString().toUpperCase()) {
            return 1 * (isAsc ? 1 : -1);
        } else {
            return 0;
        }
    }
}

