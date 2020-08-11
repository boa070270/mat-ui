import {Component} from '@angular/core';
import {BuilderFieldControlConfiguration, EnumInputType, FormConfiguration} from 'ui-lib';
import {Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formConfiguration: FormConfiguration = {
    controls: [
      {
        formControl: BuilderFieldControlConfiguration.inputFieldConfiguration(EnumInputType.text),
        controlName: 'field1',
        hint: 'Please, input field1',
        iconName: 'Phone',
        title: 'Field 1',
        placeholder: 'There is place for Field 1',
        prefix: '+380',
        required: true,
        matFormFieldClass: 'field-class',
        group: [],
      },
      {
        formControl: BuilderFieldControlConfiguration.inputFieldConfiguration(EnumInputType.password, '', Validators.required),
        controlName: 'pwd1',
        hint: 'Please, input pwd1',
        title: 'Password 1',
        placeholder: 'There is place for Password 1',
        required: true,
        matFormFieldClass: 'field-class',
        group: [],
      },
      {
        formControl: BuilderFieldControlConfiguration.textareaFieldConfiguration('', Validators.required),
        controlName: 'text1',
        hint: 'Please, input text',
        title: 'Text 1',
        placeholder: 'There is place for text 1',
        required: true,
        matFormFieldClass: 'field-class',
        group: [],
      },
      {
        formControl: BuilderFieldControlConfiguration.selectFieldConfiguration([{name: 'Option 1', value: 'op1'}, {name: 'Option 2', value: 'op2'}], '', Validators.required),
        controlName: 'select1',
        hint: 'Please, select',
        title: 'Select 1',
        placeholder: 'There is place for select',
        required: true,
        matFormFieldClass: 'field-class',
        group: [],
      },
    ],
    options: {
      converterToForm: (v) => v,
      converterFromForm: (v) => v,
      readonly: false,
      appearance: 'standard',
      formClass: 'form-class'
    }
  };
}
