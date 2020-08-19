import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormFieldsTestComponent} from './form-fields-test/form-fields-test.component';
import {TableTestComponent} from './table-test/table-test.component';
import {DialogTestComponent} from './dialog-test/dialog-test.component';

const routes: Routes = [
  {path: 'form-fields', component: FormFieldsTestComponent},
  {path: 'table', component: TableTestComponent},
  {path: 'dialog', component: DialogTestComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
