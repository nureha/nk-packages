import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'afc-input',
  template: `
    <label *ngIf="label"><span *ngIf="required">*&nbsp;</span>{{ label }}</label>
    <afc-validate-message [control]="formControl" [name]="label"><ng-content></ng-content></afc-validate-message>
    <input class="form-control"
      [type]="type" [formControl]="formControl" [readonly]="readonly">
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AfcInputComponent),
    multi: true
  }]
})
export class AfcInputComponent implements OnInit, ControlValueAccessor {

  @Input() formControl: FormControl;
  @Input() label: string;
  @Input() type = 'text';
  @Input() set readonly(flag: boolean) {
    this._readonly = flag;
  }
  get readonly() {
    return this._readonly;
  }
  public required: boolean;
  private _readonly = false;

  constructor() {}

  ngOnInit() {
    const err = this.formControl.validator && this.formControl.validator(new FormControl());
    this.required = !!err && !!err['required'];
  }

  writeValue(_: any) {}
  registerOnChange(_: any) {}
  registerOnTouched(_: any) {}

}
