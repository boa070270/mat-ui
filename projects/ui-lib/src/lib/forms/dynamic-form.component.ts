import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {
  CommonFieldConfig, convertToInternal,
  FormConfiguration,
} from './form-configuration';

@Component({
  selector: 'lib-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent<T> implements OnInit, OnChanges {
  dynamicForm: FormGroup;
  formConfiguration: Array<CommonFieldConfig>;
  @Input() configuration: FormConfiguration;
  formClass: any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkRequired();
  }

  ngOnInit(): void {
    this.checkRequired();
    if (this.configuration.options && this.configuration.options.formClass) {
      this.formClass = this.configuration.options.formClass;
    }
    const {formConfiguration, formGroup} = convertToInternal(this.configuration);
    this.formConfiguration = formConfiguration;
    this.dynamicForm = formGroup;
  }
  checkRequired(): void {
    if (!this.configuration) {
      throw new TypeError('configuration is required');
    }
  }
  setData(data: any): void {
  }
}

