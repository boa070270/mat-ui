import {MatTableDataSource} from '@angular/material/table';
import {ComponentType} from '@angular/cdk/overlay';
import {TemplateRef} from '@angular/core';
import {Observable, PartialObserver, Subscriber, Subscription, TeardownLogic} from 'rxjs';
import {ValidatorFn} from '@angular/forms';
import {FormConfiguration} from './forms/form-configuration';

export type FunctionGetId<T> = (v: T) => string;
export type FunctionGetColumnValue<T> = (element: T, column: string) => string;
export type FunctionGetColumnMedia<T> = (element: T, column: string) => ShowMediaType;

export interface UIDataSource<T> {
  select(filter?: any): Observable<T[]>;

  delete(rows: T[]): Observable<any>;

  insert(row: T): Observable<any>;

  update(row: T): Observable<any>;

  refresh(): void;
}

/**
 * Interface is used to configure EditTableComponent
 */
export interface EditTableConfiguration<T> {
  readonly: boolean;
  /**
   * present function that return id of row
   */
  getId: FunctionGetId<T>;
  /**
   * extract column value
   */
  getColumnValue: FunctionGetColumnValue<T>;
  /**
   * if we want show media in column
   */
  getColumnMedia?: FunctionGetColumnMedia<T>;
  /**
   * all columns
   */
  allColumns: ColumnEditInfo[];
  /**
   * provide selected rows to EditTableComponent. The Id must be equal to row Id
   */
  selectedRows?: T[];
  /**
   * you can describe form or use components viewDialog, editDialog, newDialog
   */
  formConfiguration?: FormConfiguration;
  /**
   * define users commands that will emit
   */
  extendCommands?: ExtendCommands[];
  /**
   * dataSource
   */
  dataSource: UIDataSource<T>;
  newItem?: () => T;
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
export interface ShowMediaType {
  mediaType: string;
  mediaURI: string;
}
export function makeColumnInfo(columnId: string, columnName: string, displayed: boolean, isMedia: boolean): ColumnEditInfo {
  return {columnId, columnName, displayed, isMedia};
}

export const DefaultGetId: FunctionGetId<any> = (row) => row ? row.id : undefined;

interface SimpleSubscriber {
  next?: any;
  error?: any;
}

export class ObservableWithRefresh<T> extends Observable<T[]> {
  cache: T[];
  error: any;
  subscription: Subscription;
  subscribers: SimpleSubscriber[] = [];
  observable: Observable<T[]>;
  internalSubscriber: PartialObserver<T[]> = {
    next: (x ?: T[]) => {
      this.cache = x;
      this.error = null;
      for (const subs of this.subscribers) {
        subs.next(x);
      }
    },
    error: (err?: any) => {
      this.cache = null;
      this.error = err;
      for (const subs of this.subscribers) {
        subs.error(err);
      }
    },
    complete: () => {
      for (const subs of this.subscribers) {
        // subs.complete();
      }
    }
  };

  constructor(observable: Observable<T[]>) {
    super();
    this.observable = observable;
  }
  _internalSubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.observable.subscribe(this.internalSubscriber);
  }
  subscribe(nextOrPartialObserver?: any, errorOrPartialObserver?: any, complete?: any): Subscription {
    let next;
    let error = (err) => {
    };
    if (typeof nextOrPartialObserver === 'function') {
      next = nextOrPartialObserver;
      if (errorOrPartialObserver) {
        error = errorOrPartialObserver;
      }
    } else if (nextOrPartialObserver) {
      next = (nextOrPartialObserver as PartialObserver<T>).next;
      error = (nextOrPartialObserver as PartialObserver<T>).error;
    }
    if (next) {
      const simple = {next, error};
      this.subscribers.push(simple);
      if (this.cache) {
        simple.next(this.cache);
      } else if (this.error) {
        simple.error(this.error);
      } else {
        this._internalSubscribe();
      }
      return new Subscription(() => {
        this.subscribers = this.subscribers.filter(value => value !== simple);
      });
    } else {
      return Subscription.EMPTY;
    }
  }

  newSource(source: Observable<T[]>): void {
    this.observable = source;
    this._internalSubscribe();
  }
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
    if (id) {
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
