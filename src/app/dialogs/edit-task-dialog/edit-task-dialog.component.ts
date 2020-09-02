import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<EditTaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any ) { }

  taskName = new FormControl(this.data.taskName, [Validators.required]);

  priority: string;

  ngOnInit(): void {
    this.priority = this.data.priority.toString();
    this.dialogRef.disableClose = true;
  }

  getErrorMessage(): string {
    if (this.taskName.hasError('required')) {
      return 'You must put any title';
    }
  }

  onCancelButton(): void {
    this.dialogRef.close({taskName: null, priority: null, done: null});
  }

  onAcceptButton(): void {
    if (!this.taskName.invalid) {
      this.dialogRef.close({taskName: this.taskName.value, priority: this.priority, done: this.data.done});
    }
  }
}
