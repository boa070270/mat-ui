import {AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {FunctionExpr} from '@angular/compiler';
import {EventEmitter} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {hasOwnProperty} from 'tslint/lib/utils';
import {valueReferenceToExpression} from '@angular/compiler-cli/src/ngtsc/annotations/src/util';

export interface ChangeViewModel {
  hide: Array<string>;
  show: Array<string>;
  disable: Array<string>;
  enable: Array<string>;
}
export type ViewModelManage = (value: any) => ChangeViewModel;

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
  group?: Array<FormFieldConfiguration>; // TODO Is this field need?
  viewModelManage?: ViewModelManage;
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
export interface ViewModelManager {
  registerViewModelManage(fn: ViewModelManage): void;
}
export interface FormOptions {
  converterToForm?: FunctionMap;
  converterFromForm?: FunctionMap;
  readonly: boolean;
  formClass?: string | string[];
  appearance?: 'legacy' | 'standard' | 'fill' | 'outline';
  viewModelManage?: ViewModelManage;
}
export interface FormConfiguration {
  controls: Array<FormFieldConfiguration>;
  options: FormOptions;
}
export interface FormDialogConfiguration {
  configuration: FormConfiguration;
  data: any;
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
            control = new UIFormArray(children, chkCfg.validatorOrOpts, chkCfg.asyncValidator);
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
        if (cfg.viewModelManage) {
          (control as any).registerViewModelManage(cfg.viewModelManage);
        }
        result.formControlCollections[controlName] = {
          control,
          children: null
        };
      } else {
        const {formConfiguration, formControlCollections, defaultValue} = this.prepare(cfg.group);
        fld.group = formConfiguration;
        result.formControlCollections[controlName] = {
          control: this.buildFormGroup(formControlCollections, cfg),
          children: formControlCollections
        };
      }
    }
    return result;
  }
  function buildFormGroup(formControlCollections: FormControlCollections, cfg?: FormFieldConfiguration): UIFormGroup {
    const controls = {};
    for (const key in formControlCollections) {
      if (formControlCollections.hasOwnProperty(key)) {
        controls[key] = formControlCollections[key].control;
      }
    }
    const control = new UIFormGroup(controls);
    if (cfg && cfg.viewModelManage) {
      control.registerViewModelManage(cfg.viewModelManage);
    }
    return control;
  }

  const resultPrepare = prepare(configuration.controls);
  const formGroup = buildFormGroup(resultPrepare.formControlCollections);
  if (configuration.options && configuration.options.viewModelManage) {
    formGroup.registerViewModelManage(configuration.options.viewModelManage);
  }
  return {
    formConfiguration: resultPrepare.formConfiguration,
    formGroup
  };
}
function isBoxedValue(formState: any): boolean {
  return typeof formState === 'object' && formState !== null &&
    Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
}
function isEmpty(value: any): boolean {
  return value === undefined || value === null || isNaN(value) || (typeof value === 'string' && value.length === 0);
}
export function manageViewModel(controls: any, changeViewModel: ChangeViewModel): void {
  if (typeof controls === 'object') {
    for (const ctrlName of changeViewModel.disable) {
      if (controls[ctrlName]) {
        controls[ctrlName].disable({onlySelf: true, emitEvent: false});
      }
    }
    for (const ctrlName of changeViewModel.enable) {
      if (controls[ctrlName]) {
        controls[ctrlName].enable({onlySelf: true, emitEvent: false});
      }
    }
  }
}
export class UIFormControl extends FormControl implements ViewModelManager {
  immutable = false;
  defaultValue: any;
  viewModelManage: ViewModelManage;

  constructor(
    formState: any = null,
    validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
    asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
    super(formState, validatorOrOpts, asyncValidator);
    this.defaultValue = formState;
    if (isBoxedValue(formState)) {
      this.defaultValue = formState.value;
    }
  }
  registerViewModelManage(fn: ViewModelManage): void {
    this.viewModelManage = fn;
  }
  setImmutable(v: boolean): void {
    this.immutable = v;
  }
  // tslint:disable-next-line:max-line-length
  setValue(value: any, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }): void {
    super.setValue(value, options);
    this.applyImmutable(value);
    if (this.viewModelManage) {
      const result = this.viewModelManage(value);
      if (result) {
        manageViewModel(this.parent.controls, result);
        (this.parent as UIFormGroup).viewModelManageEmitter.emit(result);
      }
    }
  }
  private equalToDefault(v: any): boolean {
    if (isBoxedValue(v)) {
      return v.value === this.defaultValue;
    }
    return v === this.defaultValue;
  }
  private applyImmutable(value): void {
    if (this.immutable && this.enabled) {
      if (!this.dirty && !isEmpty(value) && !this.equalToDefault(value)) {
        this.disable({emitEvent: false, onlySelf: true});
      }
    }
  }
  enable(opts?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    if (!this.immutable || this.dirty || isEmpty(this.value) || this.equalToDefault(this.value)) {
      super.enable(opts);
    }
  }

}
export class UIFormArray extends FormArray implements ViewModelManager {
  viewModelManage: ViewModelManage;

  registerViewModelManage(fn: ViewModelManage): void {
    this.viewModelManage = fn;
  }
  setValue(value: any[], options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    super.setValue(value, options);
    if (this.viewModelManage) {
      const result = this.viewModelManage(value);
      if (result) {
        manageViewModel(this.parent.controls, result);
        (this.parent as UIFormGroup).viewModelManageEmitter.emit(result);
      }
    }
  }
  setImmutable(v: boolean): void {
    const {controls} = this;
    if (controls && controls.length > 0) {
      for (const control of controls) {
        if ((control as any).setImmutable) {
          (control as any).setImmutable(v);
        }
      }
    }
  }
}
export class UIEventEmitter<T> extends Subject<T> {
  value: T;
  emit(value?: T): void {
    const { observers } = this;
    if ( observers.length > 0 ) {
      super.next(value);
    } else {
      this.value = value;
    }
  }
  subscribe(next?: any, error?: any, complete?: any): Subscription {
    const fn = (v: any) => { next(v); };
    const sink = super.subscribe(fn);
    const value = this.value;
    if ( value !== undefined ) {
      this.value = undefined;
      this.emit(value);
    }
    return sink;
  }
}
export class UIFormGroup extends FormGroup implements ViewModelManager {
  viewModelManage: ViewModelManage;
  viewModelManageEmitter: UIEventEmitter<ChangeViewModel> = new UIEventEmitter<ChangeViewModel>();

  registerViewModelManage(fn: ViewModelManage): void {
    this.viewModelManage = fn;
  }
  setValue(value: { [p: string]: any }, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.setValue(value, options);
    if (this.viewModelManage) {
      const result = this.viewModelManage(value);
      if (result) {
        manageViewModel(this.controls, result);
        this.viewModelManageEmitter.emit(result);
      }
    }
  }
  setImmutable(v: boolean): void {
    const {controls} = this;
    if (controls) {
      for (const ctrlName in controls) {
        if ( this.hasOwnProperty(ctrlName) && (controls[ctrlName] as any).setImmutable) {
          (controls[ctrlName] as any).setImmutable(v);
        }
      }
    }
  }
}
