import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {FunctionExpr} from '@angular/compiler';
import {UIFormControl} from './uiform-control';

export interface AnyKeyString {
  [key: string]: string;
}
export enum EnumKindOfField {
  input, textarea, select, radiobutton, checkbox, datepicker, group
}
export enum EnumInputType {
  color, date, 'datetime-local', email, month, number, password, search, tel, text, time, url, week
}
export interface CommonFieldConfig {
  appearance: string;
  title: string;
  kindOfField: EnumKindOfField;
  controlName: string;
  // control: Abstr
  type?: EnumInputType;
  placeholder?: string;
  iconName?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  required?: boolean;
  options?: Array<SelectOption> | Array<string>;
  multiple?: boolean;
  matFormFieldClass?: string | string[];
  group: Array<CommonFieldConfig>;
  validationMessages?: Array<{type: string, massage: (v: any) => string}>;
}
export interface SelectOption {
  name: string;
  value: string;
}
export interface SwitchOption {
  name: string;
  value: boolean;
}

/*
 * Input
 */
export interface AbstractControlConfiguration {
  kindOf: EnumKindOfField;
  validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[];
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[];
}
export interface FormFieldConfiguration {
  immutable?: boolean;
  disabled?: boolean;
  required?: boolean;
  controlName: string;
  title: string;
  placeholder?: string;
  iconName?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  // immutable?: boolean; // do not allow change only create
  multiple?: boolean; // only for select, allow multiple
  matFormFieldClass?: string | string[];
  errorMessages?: AnyKeyString;
  // tslint:disable-next-line:max-line-length
  formControl: AbstractControlConfiguration;
  group: Array<FormFieldConfiguration>;
}
export interface GroupControlConfiguration extends AbstractControlConfiguration {
  kindOf: EnumKindOfField.group;
}
export interface InputFieldConfiguration extends AbstractControlConfiguration {
  kindOf: EnumKindOfField.input;
  defaultValue?: string | null;
  inputType?: EnumInputType;
}
export interface TextareaFieldConfiguration extends AbstractControlConfiguration {
  kindOf: EnumKindOfField.textarea;
  defaultValue?: string | number | boolean | null;
}
export interface SelectFieldConfiguration extends AbstractControlConfiguration {
  kindOf: EnumKindOfField.select;
  options: Array<SelectOption>;
  defaultValue?: string | null;
  multiple: boolean;
}
export interface RadiobuttonFieldConfiguration extends AbstractControlConfiguration {
  kindOf: EnumKindOfField.radiobutton;
  options: Array<SelectOption>;
  defaultValue?: string | null;
}
export interface CheckboxFieldConfiguration extends AbstractControlConfiguration {
  kindOf: EnumKindOfField.checkbox;
  options: Array<string>;
  defaultValue?: boolean[];
}
export interface DatepickerFieldConfiguration extends AbstractControlConfiguration {
  kindOf: EnumKindOfField.datepicker;
  defaultValue?: string | null;
}
export class BuilderFieldControlConfiguration {
  static groupControlConfiguration(  validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[],
                                     asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]): GroupControlConfiguration {
    return { kindOf: EnumKindOfField.group, validatorOrOpts, asyncValidator };
  }
  static inputFieldConfiguration(  inputType: EnumInputType,
                                   defaultValue: string | null = '',
                                   validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[],
                                   asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]): InputFieldConfiguration {
    return { kindOf: EnumKindOfField.input, defaultValue, inputType, validatorOrOpts, asyncValidator };
  }
  static textareaFieldConfiguration(defaultValue: string | null = '',
                                    validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[],
                                    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]): TextareaFieldConfiguration {
    return { kindOf: EnumKindOfField.textarea, defaultValue, validatorOrOpts, asyncValidator };
  }
  static selectFieldConfiguration(options: Array<SelectOption>,
                                  defaultValue: string | null = '',
                                  multiple: boolean = false,
                                  validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[],
                                  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]): SelectFieldConfiguration {
    return { kindOf: EnumKindOfField.select, defaultValue, options, validatorOrOpts, asyncValidator, multiple };
  }
  static radiobuttonFieldConfiguration(options: Array<SelectOption>,
                                       defaultValue: string | null = '',
                                       validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[],
                                       asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]): RadiobuttonFieldConfiguration {
    return { kindOf: EnumKindOfField.radiobutton, defaultValue, validatorOrOpts, asyncValidator, options };
  }
  static checkboxFieldConfiguration(options: Array<string>,
                                    defaultValue: boolean[],
                                    validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[],
                                    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]): CheckboxFieldConfiguration {
    return { kindOf: EnumKindOfField.checkbox, defaultValue, validatorOrOpts, asyncValidator, options };
  }
}
export type FunctionMap = (r: any) => any;
export interface FormOptions {
  converterToForm?: FunctionMap;
  converterFromForm?: FunctionMap;
  readonly: boolean;
  formClass?: string | string[];
  appearance?: string;
}
export interface FormConfiguration {
  controls: Array<FormFieldConfiguration>;
  options: FormOptions;
}
export interface FormGroupOrControl {
  children: FormControlCollections;
  control: AbstractControl;
}
export interface FormControlCollections {
  [key: string]: FormGroupOrControl;
}

interface ResultPrepare {
  formConfiguration: Array<CommonFieldConfig>;
  formControlCollections: FormControlCollections;
  // defaultValue: any;
}
export interface ResultOfConverter {
  formConfiguration: Array<CommonFieldConfig>;
  formGroup: FormGroup;
  // defaultValue: any;
}

export function convertToInternal(configuration: FormConfiguration): ResultOfConverter {
  function prepare(controls: Array<FormFieldConfiguration>): ResultPrepare {
    const appearance = configuration.options.appearance;
    const result: ResultPrepare = {
      formConfiguration: [],
      formControlCollections: {},
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
        let control: AbstractControl;
        let defaultValue;
        switch (kindOfField) {
          case EnumKindOfField.input:
            const inputCfg = (cfg.formControl as InputFieldConfiguration);
            defaultValue = cfg.disabled ? {value: inputCfg.defaultValue, disabled: true} : inputCfg.defaultValue;
            control = new UIFormControl(defaultValue, inputCfg.validatorOrOpts, inputCfg.asyncValidator);
            fld.type = inputCfg.inputType;
            break;
          case EnumKindOfField.select:
            const selectCfg = (cfg.formControl as SelectFieldConfiguration);
            defaultValue = cfg.disabled ? {value: selectCfg.defaultValue, disabled: true} : selectCfg.defaultValue;
            control = new UIFormControl(defaultValue, selectCfg.validatorOrOpts, selectCfg.asyncValidator);
            fld.options = selectCfg.options;
            fld.multiple = selectCfg.multiple;
            break;
          case EnumKindOfField.textarea:
            const textCfg = (cfg.formControl as TextareaFieldConfiguration);
            defaultValue = cfg.disabled ? {value: textCfg.defaultValue, disabled: true} : textCfg.defaultValue;
            control = new UIFormControl(defaultValue, textCfg.validatorOrOpts, textCfg.asyncValidator);
            break;
          case EnumKindOfField.datepicker:
            const dateCfg = (cfg.formControl as DatepickerFieldConfiguration);
            defaultValue = cfg.disabled ? {value: dateCfg.defaultValue, disabled: true} : dateCfg.defaultValue;
            control = new UIFormControl(defaultValue, dateCfg.validatorOrOpts, dateCfg.asyncValidator);
            break;
          case EnumKindOfField.checkbox:
            const chkCfg = (cfg.formControl as CheckboxFieldConfiguration);
            const children: FormControl[] = [];
            for (let i = 0; i < chkCfg.options.length; ++i) {
              defaultValue = cfg.disabled ? {value: chkCfg.defaultValue[i], disabled: true} : chkCfg.defaultValue[i];
              children.push(new FormControl(defaultValue));
            }
            fld.options = chkCfg.options;
            control = new FormArray(children, chkCfg.validatorOrOpts, chkCfg.asyncValidator);
            break;
          case EnumKindOfField.radiobutton:
            const radioCfg = (cfg.formControl as RadiobuttonFieldConfiguration);
            defaultValue = cfg.disabled ? {value: radioCfg.defaultValue, disabled: true} : radioCfg.defaultValue;
            control = new UIFormControl(defaultValue, radioCfg.validatorOrOpts, radioCfg.asyncValidator);
            fld.options = radioCfg.options;
            break;
        }
        if (cfg.immutable && typeof (control as UIFormControl).setImmutable === 'function') {
          (control as UIFormControl).setImmutable(true);
        }
        result.formControlCollections[controlName] = {
          control,
          children: null
        };
      } else {
        const {formConfiguration, formControlCollections, defaultValue} = this.prepare(cfg.group);
        fld.group = formConfiguration;
        result.formControlCollections[controlName] = {
          control: this.buildFormGroup(formControlCollections),
          children: formControlCollections
        };
      }
    }
    return result;
  }
  function buildFormGroup(formControlCollections: FormControlCollections): FormGroup {
    const controls = {};
    for (const key in formControlCollections) {
      if (formControlCollections.hasOwnProperty(key)) {
        controls[key] = formControlCollections[key].control;
      }
    }
    return new FormGroup(controls);
  }

  const resultPrepare = prepare(configuration.controls);
  return {
    formConfiguration: resultPrepare.formConfiguration,
    formGroup: buildFormGroup(resultPrepare.formControlCollections)
  };
}
