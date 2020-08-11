import {AbstractControlOptions, AsyncValidatorFn, FormControl, FormGroup, ValidatorFn} from '@angular/forms';

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
  options?: Array<SelectOption>;
  matFormFieldClass?: string | string[];
  group: Array<CommonFieldConfig>;
}
export interface SelectOption {
  name: string;
  value: string;
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
  required?: boolean;
  controlName: string;
  title: string;
  placeholder?: string;
  iconName?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
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
}
export interface RadiobuttonFieldConfiguration extends AbstractControlConfiguration {
  kindOf: EnumKindOfField.radiobutton;
  defaultValue?: string | null;
}
export interface CheckboxFieldConfiguration extends AbstractControlConfiguration {
  kindOf: EnumKindOfField.checkbox;
  defaultValue?: string | null;
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
                                  validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[],
                                  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]): SelectFieldConfiguration {
    return { kindOf: EnumKindOfField.select, defaultValue, options, validatorOrOpts, asyncValidator };
  }
  static radiobuttonFieldConfiguration(defaultValue: string | null = null,
                                       validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[],
                                       asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]): RadiobuttonFieldConfiguration {
    return { kindOf: EnumKindOfField.radiobutton, defaultValue, validatorOrOpts, asyncValidator };
  }
  static checkboxFieldConfiguration(defaultValue: string | null = null,
                                    validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[],
                                    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]): CheckboxFieldConfiguration {
    return { kindOf: EnumKindOfField.checkbox, defaultValue, validatorOrOpts, asyncValidator };
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
  control: FormControl | FormGroup;
}
export interface FormControlCollections {
  [key: string]: FormGroupOrControl;
}
