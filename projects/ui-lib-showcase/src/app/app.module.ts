import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { DataEditorComponent } from './data-editor.component';
import {FormsModule, UiLibModule} from 'ui-lib';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DataEditorComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        UiLibModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
