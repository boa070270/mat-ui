import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
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
import {ComponentType} from '@angular/cdk/overlay';
import {DynamicFormDialogComponent} from './forms/dynamic-form-dialog.component';
import {FormConfiguration} from './forms/form-configuration';

@Component({
  selector: 'lib-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss']
})
export class EditTableComponent<T> implements OnInit {

  @Input() configuration: EditTableConfiguration<T>;
  /**
   * define dialog to view row
   */
  @Input() viewDialog: ComponentType<T> | TemplateRef<T>;
  /**
   * define dialog to edit row
   */
  @Input() editDialog: ComponentType<T> | TemplateRef<T>;
  /**
   * define dialog to make new row
   */
  @Input() newDialog: ComponentType<T> | TemplateRef<T>;
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
  rowClickCount = 0;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    if (!this.configuration) {
      throw new TypeError('configuration must be present');
    }
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
    this.configuration.dataSource.select().subscribe(data => {
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
          this.configuration.dataSource.delete(rows).subscribe(() => {
            this.configuration.dataSource.refresh();
          });
          this.emitRows.emit({
            command: CommandEnum.delete,
            rows
          });
        }
      });
    }
  }

  refresh(): void {
    this.configuration.dataSource.refresh();
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
          return c.displayed;
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
    this.rowClickCount++;
    setTimeout(() => {
      this.selectionHighlighted.clear();
      this.selectionHighlighted.select(row);
      if (this.rowClickCount === 1) {
        this.emitRows.emit({
          command: CommandEnum.update,
          rows: [row]
        });
      } else if (this.rowClickCount === 2) {
        const refDialog = this.openViewDialog();
      }
      this.rowClickCount = 0;
    }, 250);
  }
  _openDialog(dialog: ComponentType<T> | TemplateRef<T>, data: any, readonly: boolean = false): MatDialogRef<any> {
    if (dialog) {
      return this.dialog.open(dialog, {data});
    } else if (this.configuration.formConfiguration) {
      this.configuration.formConfiguration.options.readonly = readonly;
      return this.dialog.open(DynamicFormDialogComponent, {
        data: {
          configuration: this.configuration.formConfiguration,
          data
        }
      });
    }
  }
  _selectedRow(): T {
    const rows = this._selectRows(this.selectionHighlighted);
    return rows[0];
  }
  openViewDialog(): MatDialogRef<any> {
    if (this.selectionHighlighted.hasValue()) {
      return this._openDialog(this.viewDialog, this._selectedRow(), true);
    }
  }
  openEditDialog(): MatDialogRef<any> {
    if (this.selectionHighlighted.hasValue()) {
      return this._openDialog(this.editDialog, this._selectedRow(), true);
    }
  }
  openNewDialog(): MatDialogRef<any> {
    return this._openDialog(this.newDialog, this.configuration.newItem(), true);
  }

  add(): void {
    const dialog = this.openNewDialog();
    if (dialog) {
      dialog.afterClosed().subscribe(data => {
        this.configuration.dataSource.insert(data).subscribe(() => this.configuration.dataSource.refresh());
      });
    }
  }

  edit(): void {
    const dialog = this.openEditDialog();
    if (dialog) {
      dialog.afterClosed().subscribe(data => {
        if (data) {
          this.configuration.dataSource.update(data).subscribe(() => this.configuration.dataSource.refresh());
        }
      });
    }
  }
}
