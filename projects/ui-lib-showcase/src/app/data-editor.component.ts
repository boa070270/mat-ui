import { Component, OnInit } from '@angular/core';
import {EditTableConfiguration} from '../../../ui-lib/src/lib/ui-types';
import {TestData} from './common-api.service';

@Component({
  selector: 'app-data-editor',
  templateUrl: './data-editor.component.html',
  styleUrls: ['./data-editor.component.sass']
})
export class DataEditorComponent implements OnInit {

  configuration: EditTableConfiguration<TestData>;
  constructor() { }

  ngOnInit(): void {
  }

}
