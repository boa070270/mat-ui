import { Component, OnInit } from '@angular/core';
import {ObservableWithRefresh, UIDataSource} from 'ui-lib';
import {from, generate, Observable} from 'rxjs';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {map} from 'rxjs/operators';
import {fromFetch} from 'rxjs/fetch';
import {fromPromise} from 'rxjs/internal-compatibility';
import {TestData} from '../common-api.service';

@Component({
  selector: 'app-carousel-test',
  templateUrl: './carousel-test.component.html',
  styleUrls: ['./carousel-test.component.sass']
})
export class CarouselTestComponent implements OnInit {
  datasource: UIDataSource<any> = new TextDataSource();

  constructor() { }

  ngOnInit(): void {
  }

}
interface Data {
  src: string;
}

const FILES = [
  'alice.jpg', 'b1.PNG', 'background.jpg', 'barmalesha.jpg', 'black.jpg', 'fiona.jpg', 'i2.PNG', 'logo.jpg', 'monya.jpg', 'nick.jpg', 'nyura.jpg', 'osya.jpg', 'rubik.jpg', 'tasya.jpg', 'taya.jpg', 'tihon.jpg', 'una.jpg'
];

class TextDataSource implements UIDataSource<Data> {
  observable: ObservableWithRefresh<Data>;
  pos = 0;

  constructor() {
    this.observable = new ObservableWithRefresh<Data>(this.newGenerator());
  }

  newGenerator(): Observable<Data[]> {
    if (this.pos === (FILES.length - 1)) {
      this.pos = 0;
    }
    let end = this.pos + 7;
    if (end >= FILES.length) {
      end = FILES.length - 1;
    }
    const next = FILES.slice(this.pos, end);
    this.pos = end;
    return fromPromise(Promise.resolve(next.map(value => ({src: '/assets/carousel/' + value}))));
  }

  delete(rows: Data[]): Observable<any> {
    return undefined;
  }

  insert(row: Data): Observable<any> {
    return undefined;
  }

  refresh(): void {
    this.observable.newSource(this.newGenerator());
  }

  select(filter?: any): Observable<Data[]> {
    return this.observable;
  }

  update(row: Data): Observable<any> {
    return undefined;
  }

}
