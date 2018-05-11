import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

import { SelectorServiceInjector, Selectable } from '../../services';
import { AfcSelectBase } from './select-base.component';

@Component({
  selector: 'afc-radio',
  template: `
    <p *ngIf="!!label"><span [hidden]="!required">*&nbsp;</span>{{ label }}</p>
    <afc-validate-message [control]="formControl" [name]="label"><ng-content></ng-content></afc-validate-message>
    <label htmlFor="{{ id }}_{{ item.forSelectValue }}" *ngFor="let item of data" class="radio-inline custom-radio nowrap">
      <input id="{{ id }}_{{ item.forSelectValue }}" type="radio" class="form-control" name="{{ id }}"
        [value]="item.forSelectValue" [formControl]="innerFormControl">
      <span [innerHtml]="item.forSelectName"></span>
    </label>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AfcRadioComponent),
    multi: true
  },
    SelectorServiceInjector
  ]
})
export class AfcRadioComponent extends AfcSelectBase {

  @Input() formControl: FormControl;
  @Input() sourceName: string;
  @Input() label: string;
  @Input() valueType = 'number';
  @Input() list: any[] = [];
  @Input() rejects: any[] = [];

  constructor(
    services: SelectorServiceInjector
  ) {
    super(services);
  }

}
