import {AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';

function isBoxedValue(formState: any): boolean {
  return typeof formState === 'object' && formState !== null &&
    Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
}

export class UIFormControl extends FormControl {
  immutable = false;
  defaultValue: any;
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
  setImmutable(v: boolean): void {
    this.immutable = v;
  }
  // tslint:disable-next-line:max-line-length
  setValue(value: any, options?: { onlySelf?: boolean; emitEvent?: boolean; emitModelToViewChange?: boolean; emitViewToModelChange?: boolean }): void {
    super.setValue(value, options);
    this.applyImmutable(value);
  }
  private equalToDefault(v: any): boolean {
    if (isBoxedValue(v)) {
      return v.value === this.defaultValue;
    }
    return v === this.defaultValue;
  }
  private applyImmutable(value): void {
    if (this.immutable) {
      if (this.dirty || value === null || ('' + value).length === 0 || this.equalToDefault(value)) {
        this.enable({emitEvent: false, onlySelf: true});
      } else {
        this.disable({emitEvent: false, onlySelf: true});
      }
    }
  }
}
