import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
  ExtendCommands,
  EditTableConfiguration,
  ColumnEditInfo,
  CommandEnum,
  TableEvent,
  Selector,
  FunctionGetColumnValue, ObservableWithRefresh
} from './ui-types';
import {MatTableDataSource} from '@angular/material/table';
import {ColumnEditorComponent} from './column-editor.component';
import {YesNoDialogComponent} from './yes-no-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'lib-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss']
})
export class EditTableComponent<T> implements OnInit {

  @Input() configuration!: EditTableConfiguration<T>;
  @Output() emitRows = new EventEmitter<TableEvent>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  extendCommands: ExtendCommands[];
  getColumnValue: FunctionGetColumnValue<T>;
  selection: Selector<T>;
  dataSource: MatTableDataSource<T>;
  selectionHighlighted: Selector<T>;
  columns: ColumnEditInfo[];
  columnsWithSelect: string[];
  resultsLength = 0;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.selection = new Selector(this.configuration.getId, this.configuration.selectedRows);
    this.selectionHighlighted = new Selector(this.configuration.getId);
    this.columnsWithSelect = ['#select'];
    this.columns = this.configuration.allColumns.filter(c => {
      if (c.displayed){
        this.columnsWithSelect.push(c.columnId);
        return true;
      }
    });
    this.extendCommands = this.configuration.extendCommands;
    this.getColumnValue = this.configuration.getColumnValue;
    this.dataSource = new MatTableDataSource<T>([]);
    this.configuration.data.subscribe(data => {
      this.dataSource.data = data;
      this.resultsLength = data.length;
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyDataFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  _selectRows(selector: Selector<T>): T[] {
    if (selector) {
      const data = this.dataSource.data;
      return data.filter(r => selector.isSelected(r));
    }
    return [];
  }
  delete(): void {
    const rows = this._selectRows(this.selection);
    if (rows.length > 0) {
      const msg = rows.length > 1 ? rows.length + ' rows' : 'this row';
      const dialogRef = this.dialog.open(YesNoDialogComponent, {
        // width: '400px',
        data: 'Do you really want do delete ' + msg
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selection.clear();
          this.configuration.deleteRows(rows);
          this.emitRows.emit({
            command: CommandEnum.delete,
            rows
          });
        }
      });
    }
  }

  refresh(): void {
    const refreshable = this.configuration.data;
    if (refreshable instanceof ObservableWithRefresh) {
      (refreshable as ObservableWithRefresh<T>).refresh();
    }
    this.emitRows.emit({
      command: CommandEnum.refresh,
      rows: []
    });
  }

  columnEditor(): void {
    const data: ColumnEditInfo[] = this.configuration.allColumns;
    const dialogRef = this.dialog.open(ColumnEditorComponent, {
      width: '600px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0){
        this.columnsWithSelect = ['#select'];
        this.columns = result.filter(c => {
          if (c.displayed) {
            this.columnsWithSelect.push(c.columnId);
          }
        });
      }
    });
  }

  customMenu(customCommand: string): void {
    const rows = this._selectRows(this.selection);
    this.emitRows.emit({
      command: CommandEnum.custom,
      rows,
      customCommand
    });
  }

  rowClick(row: any): void {
    this.selectionHighlighted.clear();
    this.selectionHighlighted.select(row);
    this.emitRows.emit({
      command: CommandEnum.update,
      rows: [row]
    });
  }

}
