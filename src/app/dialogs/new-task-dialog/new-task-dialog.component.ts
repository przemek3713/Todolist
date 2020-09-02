import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.css']
})
export class NewTaskDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<NewTaskDialogComponent>) { }

  taskName = new FormControl('', [Validators.required]);
  priority = 0;

  getErrorMessage(): string {
    if (this.taskName.hasError('required')) {
      return 'You must put any title';
    }
  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
  }

  onAddButton(): void {
    if (!this.taskName.invalid) {
      this.dialogRef.close({taskName: this.taskName, priority: this.priority, done: false});
    }
  }

  onCloseButton(): void {
    this.dialogRef.close({taskName: null, priority: null, done: null});
  }
}
