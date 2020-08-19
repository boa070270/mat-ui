import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormsModule, UiLibModule } from 'ui-lib';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FormFieldsTestComponent } from './form-fields-test/form-fields-test.component';
import { TableTestComponent } from './table-test/table-test.component';
import { DialogTestComponent } from './dialog-test/dialog-test.component';

@NgModule({
  declarations: [
    AppComponent,
    FormFieldsTestComponent,
    TableTestComponent,
    DialogTestComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        UiLibModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
