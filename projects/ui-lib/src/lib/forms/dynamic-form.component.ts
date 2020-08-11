import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {
  CheckboxFieldConfiguration,
  CommonFieldConfig,
  DatepickerFieldConfiguration,
  EnumKindOfField,
  FormConfiguration,
  FormControlCollections,
  FormFieldConfiguration,
  InputFieldConfiguration,
  RadiobuttonFieldConfiguration,
  SelectFieldConfiguration,
  TextareaFieldConfiguration
} from './form-configuration';

interface ResultPrepare {
  formConfiguration: Array<CommonFieldConfig>;
  formControlCollections: FormControlCollections;
  defaultValue: any;
}

@Component({
  selector: 'lib-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnInit, OnChanges {
  hide = false;
  dynamicForm: FormGroup;
  defaultValue: any;
  formControlCollections: FormControlCollections;
  formConfiguration: Array<CommonFieldConfig>;
  @Input() configuration!: FormConfiguration;
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
    this.formControlCollections = {};
    const {formConfiguration, formControlCollections, defaultValue} = this.prepare(this.configuration.controls);
    this.formControlCollections = formControlCollections;
    this.formConfiguration = formConfiguration;
    this.defaultValue = defaultValue;
    this.dynamicForm = this.buildFormGroup(this.formControlCollections);
  }
  checkRequired(): void {
    if (!this.configuration) {
      throw new TypeError('configuration is required');
    }
  }

  buildFormGroup(formControlCollections: FormControlCollections): FormGroup {
    const controls = {};
    for (const key in formControlCollections) {
      if (formControlCollections.hasOwnProperty(key)) {
        controls[key] = formControlCollections[key].control;
      }
    }
    return new FormGroup(controls);
  }
  prepare(controls: Array<FormFieldConfiguration>): ResultPrepare {
    const appearance = this.configuration.options.appearance;
    const result: ResultPrepare = {
      formConfiguration: [],
      formControlCollections: {},
      defaultValue: {}
    };
    for (const cfg of controls) {
      const controlName = cfg.controlName;
      if (result.formControlCollections[controlName]) {
        throw new Error(`Incorrect configuration, duplicate field: ${controlName}`);
      }
      const kindOfField = cfg.formControl.kindOf;
      const fld: CommonFieldConfig = {
        appearance,
        title: cfg.title,
        controlName,
        kindOfField,
        group: [],
        suffix: cfg.suffix,
        prefix: cfg.prefix,
        placeholder: cfg.placeholder,
        iconName: cfg.iconName,
        hint: cfg.hint,
        type: null,
        options: null,
        required: cfg.required,
        matFormFieldClass: cfg.matFormFieldClass
      };
      result.formConfiguration.push(fld);
      if (kindOfField !== EnumKindOfField.group) {
        let control: FormControl;
        switch (kindOfField) {
          case EnumKindOfField.input:
            const inputCfg = (cfg.formControl as InputFieldConfiguration);
            result.defaultValue[controlName] = inputCfg.defaultValue;
            control = new FormControl(inputCfg.defaultValue, inputCfg.validatorOrOpts, inputCfg.asyncValidator);
            fld.type = inputCfg.inputType;
            break;
          case EnumKindOfField.select:
            const selectCfg = (cfg.formControl as SelectFieldConfiguration);
            result.defaultValue[controlName] = selectCfg.defaultValue;
            control = new FormControl(selectCfg.defaultValue, selectCfg.validatorOrOpts, selectCfg.asyncValidator);
            fld.options = selectCfg.options;
            break;
          case EnumKindOfField.textarea:
            const textCfg = (cfg.formControl as TextareaFieldConfiguration);
            result.defaultValue[controlName] = textCfg.defaultValue;
            control = new FormControl(textCfg.defaultValue, textCfg.validatorOrOpts, textCfg.asyncValidator);
            break;
          case EnumKindOfField.checkbox:
            const chkCfg = (cfg.formControl as CheckboxFieldConfiguration);
            result.defaultValue[controlName] = chkCfg.defaultValue;
            control = new FormControl(chkCfg.defaultValue, chkCfg.validatorOrOpts, chkCfg.asyncValidator);
            break;
          case EnumKindOfField.datepicker:
            const dateCfg = (cfg.formControl as DatepickerFieldConfiguration);
            result.defaultValue[controlName] = dateCfg.defaultValue;
            control = new FormControl(dateCfg.defaultValue, dateCfg.validatorOrOpts, dateCfg.asyncValidator);
            break;
          case EnumKindOfField.radiobutton:
            const radioCfg = (cfg.formControl as RadiobuttonFieldConfiguration);
            result.defaultValue[controlName] = radioCfg.defaultValue;
            control = new FormControl(radioCfg.defaultValue, radioCfg.validatorOrOpts, radioCfg.asyncValidator);
            break;
        }
        result.formControlCollections[controlName] = {
          control,
          children: null
        };
      } else {
        const {formConfiguration, formControlCollections, defaultValue} = this.prepare(cfg.group);
        fld.group = formConfiguration;
        result.defaultValue[controlName] = defaultValue;
        result.formControlCollections[controlName] = {
          control: this.buildFormGroup(formControlCollections),
          children: formControlCollections
        };
      }
    }
    return result;
  }
}

