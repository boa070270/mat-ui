import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChangeViewModel, CommonFieldConfig, EnumInputType, EnumKindOfField, UIFormGroup} from './form-configuration';
import {AbstractControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'lib-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldsComponent implements OnInit, OnChanges {
  hide = true;
  enumKindOfField = EnumKindOfField;
  enumInputType = EnumInputType;
  controls: {
    [key: string]: AbstractControl;
  };
  controlsView: any = {};
  @Input() formGroup: UIFormGroup;
  @Input() formConfiguration: Array<CommonFieldConfig>;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkRequired();
  }

  ngOnInit(): void {
    this.checkRequired();
    this.controls = this.formGroup.controls;
    console.log('FormFieldsComponent.ngOnInit');
    this.formGroup.viewModelManageEmitter.subscribe((change: ChangeViewModel) => {
      if (change.hide && change.hide.length > 0) {
        const controls = Object.assign({}, this.controlsView);
        for (const ctrlName of change.hide) {
          controls[ctrlName] = true;
        }
        for (const ctrlName of change.show) {
          delete controls[ctrlName];
        }
        this.controlsView = controls;
      }
    });
  }
  checkRequired(): void {
    if ( !this.formGroup) {
      throw new TypeError('formConfiguration is required');
    }
    if (!this.formConfiguration) {
      throw new TypeError('formConfiguration is required');
    }
  }
  formControlByName(controlName: string): AbstractControl {
    return this.formGroup.get(controlName);
  }
}
