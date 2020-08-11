import {ObservableWithRefresh} from '../src/lib/ui-types';
import {generate} from 'rxjs';
import {map} from 'rxjs/operators';

class TestObservableWithRefresh extends ObservableWithRefresh<number> {
  refresh(): void {
    this.newSource(generate(0, x => x < 10, x => x + 1));
  }
}

const observable = new TestObservableWithRefresh();

observable.subscribe(next => { console.log('A', next); } );
observable.subscribe(next => { console.log('B', next); } );
observable.pipe(map(v => v * 2)).subscribe(next => { console.log('Pipe', next); });
observable.refresh();
observable.refresh();
