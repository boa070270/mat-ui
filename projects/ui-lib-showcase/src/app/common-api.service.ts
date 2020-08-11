import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {IOptions} from 'tslint';

export interface TestData {
  id: number;
  name: string;
  type: string;
  value: any;
}
export const testDataValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const type = control.get('type');
  if (type && type.value === 'object') {
    const value = control.get('value');
    if (value && value.value) {
      try {
        JSON.parse(value.value);
      } catch (e) {
        return {jsonSyntaxError: true};
      }
    }
  }
  return null;
}
export interface DialogTestData<T> {
  row: T;
  readonly: boolean;
}
const DATA: TestData[] = [
  {id: 1, name: 'String', type: 'string', value: 'example'},
  {id: 2, name: 'Boolean', type: 'boolean', value: true},
  {id: 3, name: 'Boolean', type: 'boolean', value: false},
  {id: 4, name: 'Number', type: 'number', value: 123},
  {id: 5, name: 'Number Pi', type: 'number', value: 3.14},
  {id: 6, name: 'Object', type: 'object', value: {a: 'a', b: 'B'}},
];
@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  constructor() { }

  getDate(): Observable<TestData[]> {
    return fromPromise(sleep(100, DATA));
  }
  insert(data: TestData): Observable<number> {
    const index = DATA.findIndex(value => value.id === data.id);
    if (index >= 0) {
      return fromPromise(sleep(100, new Error(`Duplicate id: ${data.id}`)));
    }
    DATA.push(data);
    return fromPromise(sleep(100, data.id));
  }
  delete(id: number): Observable<number> {
    const index = DATA.findIndex(value => value.id === id);
    if (index >= 0) {
      DATA.splice(index, 1);
      return fromPromise(sleep(100, id));
    }
    return fromPromise(sleep(100, new Error(`Not found id: ${id}`)));
  }
  update(data: TestData): Observable<number> {
    const index = DATA.findIndex(value => value.id === data.id);
    if (index >= 0) {
      DATA[index] = data;
      return fromPromise(sleep(100, data.id));
    }
    return fromPromise(sleep(100, new Error(`Not found id: ${data.id}`)));
  }
}
function sleep(ms, value: any): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout((v) => {
        if (v instanceof Error) {
          reject(v);
        } else {
          resolve(v);
        }
      }, ms, value);
  });
}
