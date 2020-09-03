import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-config-task-dialog',
  templateUrl: './config-task-dialog.component.html',
  styleUrls: ['./config-task-dialog.component.css']
})
export class ConfigTaskDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfigTaskDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any ) { }

  taskName = new FormControl(this.data.taskName, [Validators.required]);

  priority: string;

  ngOnInit(): void {
    this.priority = this.data.priority.toString();
    this.dialogRef.disableClose = true;
  }

  getErrorMessage(): string {
    if (this.taskName.hasError('required')) {
      return 'Enter task title';
    }
  }

  onCancelButton(): void {
    this.dialogRef.close({id: null, taskName: null, priority: null, done: null});
  }

  onAcceptButton(): void {
    if (!this.taskName.invalid) {
      this.dialogRef.close({id: this.data.id, taskName: this.taskName.value, priority: this.priority, done: this.data.done});
    }
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Escape':
        this.onCancelButton();
        break;
      case 'Enter':
        this.onAcceptButton();
        break;
    }
  }

  getDialogTitle(): string {
    return this.data.taskName === '' ? 'Create a new task' : 'Edit task';
  }
}
