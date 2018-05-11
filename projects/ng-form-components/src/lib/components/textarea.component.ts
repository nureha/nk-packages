import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'afc-textarea',
  template: `
    <label *ngIf="label"><span *ngIf="required">*&nbsp;</span>{{ label }}</label>
    <afc-validate-message [control]="formControl" [name]="label"><ng-content></ng-content></afc-validate-message>
    <textarea [formControl]="formControl" class="form-control"></textarea>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AfcTextareaComponent),
    multi: true
  }]
})
export class AfcTextareaComponent implements OnInit, ControlValueAccessor {

  @Input() formControl: FormControl;
  @Input() label: string;
  public required: boolean;

  constructor() {}

  ngOnInit() {
    const err = this.formControl.validator && this.formControl.validator(new FormControl());
    this.required = err && !!err['required'];
  }

  writeValue(_: any) {}
  registerOnChange(_: any) {}
  registerOnTouched(_: any) {}

}
