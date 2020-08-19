import {Component, Inject, OnInit} from '@angular/core';
import {BuilderFieldControlConfiguration, EditTableConfiguration, EnumInputType, ObservableWithRefresh, UIDataSource} from 'ui-lib';
import {CommonApiService, TestData} from '../common-api.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from '@angular/forms';
import {generate, Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';


class DataSource implements UIDataSource<TestData>{
  observable: ObservableWithRefresh<TestData>;

  constructor(private service: CommonApiService) {
    this.observable = new ObservableWithRefresh<TestData>(this.service.getDate());
  }

  delete(rows: TestData[]): Observable<any> {
    const promises: Promise<any>[] = [];
    for (const row of rows) {
      promises.push(this.service.delete(row.id).toPromise());
    }
    return fromPromise(Promise.all(promises));
  }

  insert(row: TestData): Observable<any> {
    return this.service.insert(row);
  }

  select(filter?: any): Observable<TestData[]> {
    return this.observable;
  }

  update(row: TestData): Observable<any> {
    return this.service.update(row);
  }

  refresh(): void {
    this.observable.newSource(this.service.getDate());
  }
}

@Component({
  selector: 'app-table-test',
  templateUrl: './table-test.component.html',
  styleUrls: ['./table-test.component.sass']
})
export class TableTestComponent implements OnInit {
  tableConfiguration: EditTableConfiguration<TestData>;

  constructor(public dialog: MatDialog, private service: CommonApiService) { }

  ngOnInit(): void {
    this.tableConfiguration = {
      dataSource: new DataSource(this.service),
      newItem: () => ({id: NaN, name: '', type: '', value: ''}),
      getId: (r) => '' + r.id,
      getColumnValue: (element, column) => {
        if (column === 'value') {
          if (element.type === 'object') {
            return JSON.stringify(element.value);
          }
          return '' + element.value;
        }
        return element[column];
      },
      allColumns: [
        { displayed: true, isMedia: false, columnId: 'id', columnName: 'Id'},
        { displayed: true, isMedia: false, columnId: 'name', columnName: 'Name'},
        { displayed: true, isMedia: false, columnId: 'type', columnName: 'Type'},
        { displayed: true, isMedia: false, columnId: 'value', columnName: 'Value'},
      ],
      formConfiguration: {
        options: {
          converterToForm: (v) => {
            return {
              id: v.id, name: v.name, type: v.type,
              valueCheck: v.type === 'boolean' ? [v.value] : [false],
              valueText: v.type === 'object' ? JSON.stringify(v.value) : '',
              valueKey: v.value};
            },
          converterFromForm: (v) => {
            const obj: any = {id: v.id, name: v.name, type: v.type};
            if (v.type === 'boolean') {
              obj.value = v.valueCheck[0];
            } else if (v.type === 'object') {
              obj.value = JSON.stringify(v.valueText);
            } else {
              obj.value = v.valueKey;
            }
            return obj;
          },
          readonly: false,
          appearance: 'standard',
          formClass: 'form-class'
        },
        controls: [
          {
            formControl: BuilderFieldControlConfiguration.inputFieldConfiguration(EnumInputType.text),
            controlName: 'id',
            hint: 'Please, input Id',
            title: 'Id',
            placeholder: 'There is unique Id',
            required: true,
            matFormFieldClass: 'field-class',
            immutable: true,
          },
          {
            formControl: BuilderFieldControlConfiguration.inputFieldConfiguration(EnumInputType.text),
            controlName: 'name',
            hint: 'Please, input Name',
            title: 'Name',
            placeholder: 'There is name of field, it is mandatory',
            required: true,
            matFormFieldClass: 'field-class',
            immutable: true,
          },
          {
            formControl: BuilderFieldControlConfiguration.selectFieldConfiguration(
              [
                {name: 'String', value: 'string'},
                {name: 'Boolean', value: 'boolean'},
                {name: 'Number', value: 'number'},
                {name: 'Object', value: 'object'},
              ]),
            controlName: 'type',
            hint: 'Please, select Type',
            title: 'Type',
            placeholder: 'Type define data that is stored',
            required: true,
            matFormFieldClass: 'field-class',
            // immutable: true,
            viewModelManage: value => {
              if (value === 'object') {
                return {show: ['valueText'], hide: ['valueKey', 'valueCheck'], enable: [], disable: []};
              } else if (value === 'boolean') {
                return {show: ['valueCheck'], hide: ['valueKey', 'valueText'], enable: [], disable: []};
              }
              return {show: ['valueKey'], hide: ['valueCheck', 'valueText'], enable: [], disable: []};
            }
          },
          {
            formControl: BuilderFieldControlConfiguration.inputFieldConfiguration(EnumInputType.text),
            controlName: 'valueKey',
            hint: 'Please, input value. There is not mandatory',
            title: 'Value',
            placeholder: 'any string',
            required: false,
            matFormFieldClass: 'field-class',
            immutable: false,
          },
          {
            formControl: BuilderFieldControlConfiguration.textareaFieldConfiguration(''),
            controlName: 'valueText',
            hint: 'Please, input text',
            title: 'Value',
            placeholder: 'any text',
            required: false,
            matFormFieldClass: 'field-class',
          },
          {
            formControl: BuilderFieldControlConfiguration.checkboxFieldConfiguration([''], [false]),
            controlName: 'valueCheck',
            hint: 'true - checked, false - empty',
            title: 'Value',
            required: false,
            matFormFieldClass: 'field-class',
          },
        ]
        },
      extendCommands: null,
      selectedRows: null
    };
    }

}
