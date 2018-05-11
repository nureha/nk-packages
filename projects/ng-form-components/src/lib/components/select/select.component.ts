import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { filter, combineLatest } from 'rxjs/operators';

import { SelectorServiceInjector, Selectable } from '../../services';
import { AfcSelectBase } from './select-base.component';

@Component({
  selector: 'afc-select',
  template: `
    <label *ngIf="label" [htmlFor]="id"><span [hidden]="!required">*&nbsp;</span>{{ label }}</label>
    <ng-container *ngIf="!readonly">
      <afc-validate-message [control]="formControl" [name]="label"><ng-content></ng-content></afc-validate-message>
      <select [id]="id" class="form-control" [formControl]="innerFormControl" [required]="required">
        <option *ngIf="!required" [ngValue]="null"></option>
        <option *ngFor="let item of data" [ngValue]="item.forSelectValue" [innerHtml]="item.forSelectName"></option>
      </select>
    </ng-container>
    <ng-container *ngIf="readonly">
      <span class="form-control" readonly [innerHtml]="selected?.forSelectName"></span>
    </ng-container>
  `,
  styles: [`
    span.selected {
      text-decoration: underline;
      text-decoration-style: double;
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AfcSelectComponent),
    multi: true
  },
    SelectorServiceInjector
  ]
})
export class AfcSelectComponent extends AfcSelectBase {

  @Input() formControl: FormControl;
  @Input() sourceName: string;
  @Input() label: string;
  @Input() valueType = 'number';
  @Input() list: any[] = [];
  @Input() rejects: any[] = [];
  @Input() set readonly(flag: boolean) {
    this._readonly = flag;
  }
  get readonly() {
    return this._readonly;
  }
  public selected: Selectable = null;
  private _readonly = false;

  constructor(
    services: SelectorServiceInjector
  ) {
    super(services);
    this.dataPrepared$.pipe(
      filter(v => !!v),
      combineLatest(this.innerFormControl.valueChanges)
    ).subscribe(v => {
      this.selected = this.data.find(d => d.forSelectValue === v[1]);
    });
  }

}
