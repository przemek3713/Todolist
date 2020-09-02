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

  autoIncrement(): number {
    let index = 0;

    while (true) {

      const avaiableID = this.data.find(element => {
        return element.id === index;
      });

      if (avaiableID === undefined) {
        return index;
      } else {
        index++;
      }
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

  disconnect() {
  }

  private getPagedData(data: AssignmentInterFace[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  public addTask(id: number, taskName: string, priority: number, done: boolean) {
    this.data.push({id, taskName, priority, done});
  }

  private getSortedData(data: AssignmentInterFace[]) {
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
