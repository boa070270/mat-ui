import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { UiLibComponent } from './ui-lib.component';
import { ColumnEditorComponent } from './column-editor.component';
import { YesNoDialogComponent } from './yes-no-dialog.component';
import { ShowMediaDialogComponent } from './show-media-dialog.component';
import { ShowMediaValueComponent } from './show-media-value.component';
import { ShowValueComponent } from './show-value.component';
import { EditTableComponent } from './edit-table.component';
import { MatSelectModule } from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import { CarouselComponent } from './carousel.component';

@NgModule({
  declarations: [
    UiLibComponent,
    ColumnEditorComponent,
    YesNoDialogComponent,
    ShowMediaDialogComponent,
    ShowMediaValueComponent, ShowValueComponent,
    EditTableComponent,
    CarouselComponent,
  ],
  imports: [
    DragDropModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatListModule
  ],
  exports: [
    UiLibComponent,
    ColumnEditorComponent,
    YesNoDialogComponent,
    ShowMediaDialogComponent,
    ShowMediaValueComponent,
    ShowValueComponent,
    EditTableComponent,
    CarouselComponent,
  ]
})
export class UiLibModule { }
