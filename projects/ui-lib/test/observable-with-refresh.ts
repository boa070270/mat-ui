import {ObservableWithRefresh} from '../src/lib/ui-types';
import {generate} from 'rxjs';
import {map, toArray} from 'rxjs/operators';

class TestObservableWithRefresh extends ObservableWithRefresh<number> {
  start = 1;
  refresh(): void {
    this.newSource(generate(this.start++, x => x < 10, x => x + 2).pipe(toArray()));
  }
}

const observable = new TestObservableWithRefresh(generate(0, x => x < 10, x => x + 1).pipe(toArray()));

console.log('log of first generator with A');
const subs1 = observable.subscribe(next => { console.log('A', next); } );
console.log('log of first generator with B');
const subs2 = observable.subscribe(next => { console.log('B', next); } );
console.log('log of second generator with A abd B');
observable.refresh();
subs1.unsubscribe();
console.log('log of third generator with B');
observable.refresh();
subs2.unsubscribe();
console.log('there are no any subscriber so no log');
observable.refresh();
console.log('subscribe C subscriber and log of fourth generator');
const subs3 = observable.subscribe(next => { console.log('C', next); } );
console.log('subscribe D subscriber and log of fourth generator');
const subs4 = observable.subscribe(next => { console.log('D', next); } );
subs3.unsubscribe();
subs4.unsubscribe();
