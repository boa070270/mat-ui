import {Component, Inject} from '@angular/core';
import {ColumnEditInfo} from './ui-types';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'lib-column-editor',
  templateUrl: './column-editor.component.html',
  styleUrls: ['./column-editor.component.scss']
})
export class ColumnEditorComponent {

  displayed: ColumnEditInfo[] = [];
  hidden: ColumnEditInfo[] = [];

  constructor(public dialogRef: MatDialogRef<ColumnEditorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ColumnEditInfo[]) {
    data.forEach(v => {
      if (v.displayed){
        this.displayed.push(v);
      } else {
        this.hidden.push(v);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  drop(event: CdkDragDrop<ColumnEditInfo[], any>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  finish(): void {
    const result = [];
    this.displayed.forEach(v => {
      v.displayed = true;
      result.push(v);
    });
    this.hidden.forEach(v => {
      v.displayed = false;
      result.push(v);
    });
    this.dialogRef.close(result);
  }

}
