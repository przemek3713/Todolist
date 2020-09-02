import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {TodolistDataSource, AssignmentInterFace} from './todolist-datasource';
import {MatDialog} from '@angular/material/dialog';
import {NewTaskDialogComponent} from '../../dialogs/new-task-dialog/new-task-dialog.component';
import {EditTaskDialogComponent} from '../../dialogs/edit-task-dialog/edit-task-dialog.component';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<AssignmentInterFace>;

  dataSource: TodolistDataSource;
  displayedColumns = ['taskName', 'priority', 'done', 'actions'];
  ids = [];

  private refreshTable(): void {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  constructor(private dialog: MatDialog,
              @Inject(LOCAL_STORAGE) private storage: StorageService) {
  }

  ngOnInit() {
    this.dataSource = new TodolistDataSource();
    const ids = this.storage.get('ids');
    if (ids !== undefined) {
      this.ids = ids;
      this.ids.forEach(element => {
        const row = this.storage.get(element);
        this.dataSource.addTask(element, row.taskName, row.priority, row.done);
      });
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  openNewTaskDialog(): void {
    const dialogRef = this.dialog.open(NewTaskDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result.taskName !== null && result.priority !== null && result.done !== null) {
        this.addTask(this.dataSource.autoIncrement(), result.taskName.value, +result.priority, false);
        this.refreshTable();
      }
    });

  }

  toggleDone(row: any, value: boolean): void {
    this.storage.set(row.id.toString(), {
      id: row.id,
      taskName: row.taskName,
      priority: row.priority,
      done: !value
    });
    this.refreshTable();
  }

  getPriority(priority: number): string {
    switch (priority) {
      case 0:
        return '';
      case 1:
        return 'Low';
      case 2:
        return 'Medium';
      case 3:
        return 'High';
      default:
        return '';
    }
  }

  addTask(id: number, taskName: string, priority: number, done: boolean) {
    this.dataSource.addTask(id, taskName, priority, done);
    this.storage.set(id.toString(), {id, taskName, priority, done});
    this.ids.push(id);
    this.storage.set('ids', this.ids);
  }

  deleteTask(row: any): void {
    const index = this.dataSource.data.indexOf(row);

    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
    }

    this.storage.remove(row.id);
    this.ids = this.ids.filter(obj => {
      return obj !== row.id;
    });

    this.storage.set('ids', this.ids);

    this.refreshTable();
  }

  editTask(row: any) {
    const element = this.dataSource.data.find(obj => {
      return obj.id === row.id;
    });

    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: row});

    dialogRef.afterClosed().subscribe(result => {
      if (result.taskName !== null && result.priority !== null && result.done !== null) {
        element.taskName = result.taskName;
        element.priority = +result.priority;

        this.storage.set(element.id.toString(), {
          id: result.id,
          taskName: result.taskName,
          priority: +result.priority,
          done: result.done
        });
      }
    });

    this.refreshTable();
  }
}
