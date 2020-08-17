import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormFieldsComponent } from './form-fields.component';
import { DynamicFormComponent } from './dynamic-form.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    DynamicFormComponent,
    FormFieldsComponent
  ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule
    ],
  exports: [
    DynamicFormComponent,
    FormFieldsComponent
  ],
})
export class FormsModule { }
