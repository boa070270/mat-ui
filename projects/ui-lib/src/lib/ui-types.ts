import {MatTableDataSource} from '@angular/material/table';
import {ComponentType} from '@angular/cdk/overlay';
import {TemplateRef} from '@angular/core';
import {Observable, Subscriber, TeardownLogic} from 'rxjs';
import {ValidatorFn} from '@angular/forms';

export type FunctionGetId<T> = (v: T) => string;
export type FunctionGetColumnValue<T> = (element: T, column: string) => string;

/**
 * Interface is used to configure EditTableComponent
 */
export interface EditTableConfiguration<T> {
  /**
   * present function that return id of row
   */
  getId: FunctionGetId<T>;
  /**
   * extract column value
   */
  getColumnValue: FunctionGetColumnValue<T>;
  /**
   * define dialog to view row
   */
  viewDialog: ComponentType<T> | TemplateRef<T>;
  /**
   * define dialog to edit row
   */
  editDialog: ComponentType<T> | TemplateRef<T>;
  /**
   * define dialog to make new row
   */
  newDialog: ComponentType<T> | TemplateRef<T>;
  /**
   * define users commands that will emit
   */
  extendCommands: ExtendCommands[];
  /**
   * all columns
   */
  allColumns: ColumnEditInfo[];
  /**
   * Observable of data
   */
  data: Observable<T[]>;
  /**
   * provide selected rows to EditTableComponent. The Id must be equal to row Id
   */
  selectedRows: T[];
  /**
   * delete rows
   */
  deleteRows(rows: T[]): void;
}
export interface TableEvent {
  command: CommandEnum;
  rows: any[];
  customCommand?: string;
}
export enum CommandEnum {
  refresh,
  delete,
  update,
  custom
}
export class ExtendCommands {
  iconName: string;
  menuName: string;
  commandName: string;
}
export interface ColumnEditInfo {
  displayed: boolean;
  isMedia: boolean;
  columnId: string;
  columnName: string;
}
export const DefaultGetId: FunctionGetId<any> = (row) => row ? row.id : undefined;

export interface Refreshable {
  refresh(): void;
}
export abstract class ObservableWithRefresh<T> extends Observable<T> implements Refreshable {
  subscribers: Subscriber<T>[] = [];
  observable: Observable<T>;
  internalSubscriberID = Math.random().toString(36);
  constructor(observable: Observable<T>) {
    super();
    this.observable = observable;
  }
  internalSubscriber(): Subscriber<T> {
    const subscriber = Subscriber.create<T>(
      (x?: T) => {
        for (const subs of this.subscribers) {
          subs.next(x);
        }
      },
      (err?: any) => {
        for (const subs of this.subscribers) {
          subs.error(err);
        }
      },
      () => {
        for (const subs of this.subscribers) {
          // subs.complete();
        }
      });
    (subscriber as any).internalSubscriberID = this.internalSubscriberID;
    return subscriber;
  }
  _subscribe(subscriber: Subscriber<T>): TeardownLogic {
    if ((subscriber as any).internalSubscriberID !== this.internalSubscriberID) {
      this.subscribers.push(subscriber);
    }
    return this.observable && this.observable.subscribe(this.internalSubscriber());
  }
  newSource(source: Observable<T>): void {
    this.observable = source;
    if (this.subscribers.length > 0){
      this.subscribe(this.internalSubscriber());
    }
  }
  abstract refresh(): void;
}

export class Selector<T> {
  selected: Set<string>;
  constructor(private getId: FunctionGetId<T> = DefaultGetId, selected?: T[]) {
    this.selected = new Set<string>();
    if (selected) {
      selected.forEach(v => this.selected.add(getId(v)));
    }
  }
  hasValue(): boolean {
    return this.selected.size > 0;
  }
  isNotEmpty(): boolean {
    return this.selected.size > 0;
  }
  toggle(row: T): boolean {
    const id = this.getId(row);
    if (id) {
      if (this.selected.has(id)) {
        this.selected.delete(id);
        return false;
      } else {
        this.selected.add(id);
        return true;
      }
    }
  }
  isSelected(row: T): boolean {
    const id = this.getId(row);
    return id ? this.selected.has(id) : null;
  }
  clear(): void {
    this.selected.clear();
  }
  select(row: T): void {
    const id = this.getId(row);
    if ( id ) {
      this.selected.add(id);
    }
  }
  getSelected(): string[] {
    const result: string[] = [];
    this.selected.forEach(v => result.push(v));
    return result;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(dataSource: MatTableDataSource<T>): boolean {
    const numSelected = this.selected.size;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(dataSource: MatTableDataSource<T>): void {
    this.isAllSelected(dataSource) ?
      this.clear() :
      dataSource.data.forEach(row => this.select(row));
  }
}
