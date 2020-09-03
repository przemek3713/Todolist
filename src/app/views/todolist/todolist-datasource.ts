import {DataSource} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {map} from 'rxjs/operators';
import {Observable, of as observableOf, merge} from 'rxjs';

export interface AssignmentInterFace {
    id: number;
    taskName: string;
    priority: number;
    done: boolean;
}

export class TodolistDataSource extends DataSource<AssignmentInterFace> {

    constructor() {
        super();
    }

    data: AssignmentInterFace[] = [];
    paginator: MatPaginator;
    sort: MatSort;

    // search for first unused int for next id
    autoIncrement(ids: number[]): number {
        let index = 0;
        while (true) {
            if (!ids.includes(index)) {
                return index;
            }
            index++;
        }
    }

    connect(): Observable<AssignmentInterFace[]> {
        const dataMutations = [
            observableOf(this.data),
            this.paginator.page,
            this.sort.sortChange
        ];

        return merge(...dataMutations).pipe(map(() => {
            return this.getPagedData(this.getSortedData([...this.data]));
        }));
    }

    disconnect(): void {
    }

    private getPagedData(data: AssignmentInterFace[]): AssignmentInterFace[] {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }

    public addTask(id: number, taskName: string, priority: number, done: boolean): void {
        this.data.push({id, taskName, priority, done});
    }

    private getSortedData(data: AssignmentInterFace[]): AssignmentInterFace[] {
        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
                case 'taskName':
                    return compare(a.taskName, b.taskName, isAsc);
                case 'priority':
                    return compare(+a.priority, +b.priority, isAsc);
                case 'done':
                    return compare(+a.done, +b.done, isAsc);
                default:
                    return 0;
            }
        });
    }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
