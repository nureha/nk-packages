/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Type, Injectable, Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { from, Observable, Subject, timer } from 'rxjs';
import { share } from 'rxjs/operators';

import { AfcSelectComponent } from './select.component';
import { AfcCheckboxComponent } from './checkbox.component';
import { AfcValidateMessageComponent } from '../validate-message.component';
import {
  SelectorService, Selectable,
  NoopErrorMessageFactoryService, ERROR_MESSAGE_FACTORY_SERVICE, SELECTOR_SERVICE_INJECTOR
} from '../../services';

class SelectableConstruct extends Selectable {
  name: string;
  value: any;
  default: boolean;
  get forSelectName() {
    return this.name;
  }
  get forSelectValue() {
    return this.value;
  }
  get forSelectDefault() {
    return this.default;
  }
  get forSelectOrder() {
    return this.name;
  }
  constructor(data: any) {
    super();
    this.name = data.name;
    this.value = data.value;
    this.default = data.default;
  }
}

class ServiceStab implements SelectorService {
  private action$ = new Subject<Selectable[]>();
  protected data: Selectable[];
  query(condition: {[key: string]: any}) {
    condition = condition || {};
    const delay = parseInt(condition['delay'] || 0, 10);
    const subscription = timer(delay).subscribe(() => {
      this.action$.next(this.data);
      setTimeout(() => subscription.unsubscribe());
    });
  }
  list() {
    return this.action$.pipe(share());
  }
}

class FruitService extends ServiceStab {
  protected data = [{
    name: 'apple',
    value: 1,
    default: false
  }, {
    name: 'orange',
    value: 2,
    default: true
  }, {
    name: 'banana',
    value: 3,
    default: false
  }].map(d => new SelectableConstruct(d));
}

class ColorService extends ServiceStab {
  protected data = [{
    name: 'blue',
    value: 1,
    default: false
  }, {
    name: 'red',
    value: 2,
    default: true
  }, {
    name: 'yellow',
    value: 3,
    default: false
  }].map(d => new SelectableConstruct(d));
}

@Component({
  selector: 'afc-only-afc-select-component',
  template: `
    <afc-select *ngIf="formControl"
      [formControl]="formControl" [sourceName]="sourceName"
    ></afc-select>
    <afc-checkbox *ngIf="formControl2"
      [formControl]="formControl2" [sourceName]="sourceName2"
    ></afc-checkbox>
  `
})
class OnlyAfcSelectComponent {
  formControl: FormControl;
  sourceName: string;
  formControl2: FormControl;
  sourceName2: string;
}

describe('AfcSelectComponent', () => {
  let component: OnlyAfcSelectComponent;
  let fixture: ComponentFixture<OnlyAfcSelectComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OnlyAfcSelectComponent,
        AfcSelectComponent,
        AfcCheckboxComponent,
        AfcValidateMessageComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [{
        provide: ERROR_MESSAGE_FACTORY_SERVICE,
        useClass: NoopErrorMessageFactoryService,
      }, {
        provide: SELECTOR_SERVICE_INJECTOR,
        useFactory: () => {
          return {
            get(name: string) {
              switch (name) {
                case 'fruit':
                  return new FruitService();
                case 'color':
                  return new ColorService();
              }
            }
          };
        }
      }]
    })
    .compileComponents();
  }));

  it('should set default value for required form', fakeAsync(() => {
    fixture = TestBed.createComponent(OnlyAfcSelectComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl(null, Validators.required);
    component.sourceName = 'fruit';
    // 上記変更を反映
    fixture.detectChanges();
    // service の query 待ち
    tick(1);
    // 内部の値の変更を反映
    fixture.detectChanges();
    expect(component.formControl.value).toEqual(2);
    expect(fixture.debugElement.query(By.css('option:checked')).nativeElement.textContent).toBe('orange');
  }));
  it('should keep value which set before loading data', fakeAsync(() => {
    fixture = TestBed.createComponent(OnlyAfcSelectComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl(1, Validators.required);
    component.sourceName = 'fruit:delay=1000';
    // 上記変更を反映
    fixture.detectChanges();
    // service の query 待ち
    tick(1500);
    // 内部の値の変更を反映
    fixture.detectChanges();
    expect(component.formControl.value).toEqual(1);
    expect(fixture.debugElement.query(By.css('option:checked')).nativeElement.textContent).toBe('apple');
  }));
  it('should have own each service', fakeAsync(() => {
    fixture = TestBed.createComponent(OnlyAfcSelectComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl(1, Validators.required);
    component.sourceName = 'color';
    component.formControl2 = new FormControl([1, 2]);
    component.sourceName2 = 'fruit:delay=1000';
    // 上記変更を反映
    fixture.detectChanges();
    // service の query 待ち
    tick(1);
    // 内部の値の変更を反映
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('option')).length).toBe(3);
    expect(fixture.debugElement.queryAll(By.css('[type="checkbox"]')).length).toBe(0);
    tick(1500);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('option')).length).toBe(3);
    expect(fixture.debugElement.queryAll(By.css('[type="checkbox"]')).length).toBe(3);
  }));
  it('should be checked values', fakeAsync(() => {
    fixture = TestBed.createComponent(OnlyAfcSelectComponent);
    component = fixture.componentInstance;
    component.formControl2 = new FormControl([1, 3]);
    component.sourceName2 = 'fruit';
    // 上記変更を反映
    fixture.detectChanges();
    // service の query 待ち
    tick(1);
    // 内部の値の変更を反映
    fixture.detectChanges();
    const checkedInput = fixture.debugElement.queryAll(By.css('[type="checkbox"]:checked + span'));
    expect(checkedInput.length).toBe(2);
    expect(checkedInput[0].nativeElement.textContent).toContain('apple');
    expect(checkedInput[1].nativeElement.textContent).toContain('banana');
  }));
  it('should be reset value if not required', fakeAsync(() => {
    const SET_VALUE_FOR_CONTROL = 1;
    fixture = TestBed.createComponent(OnlyAfcSelectComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl(SET_VALUE_FOR_CONTROL);
    component.sourceName = 'fruit';
    // 上記変更を反映
    fixture.detectChanges();
    // service の query 待ち
    tick(1);
    // 内部の値の変更を反映
    fixture.detectChanges();
    expect(component.formControl.value).toEqual(SET_VALUE_FOR_CONTROL);
    component.formControl.reset();
    tick();
    expect(component.formControl.value).toEqual(null);
    expect(fixture.debugElement.query(By.css('option:checked')).nativeElement.textContent).toBe('');
  }));
  it('should keep default value when reset required form', fakeAsync(() => {
    const SET_VALUE_FOR_CONTROL = 1;
    fixture = TestBed.createComponent(OnlyAfcSelectComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl(SET_VALUE_FOR_CONTROL, Validators.required);
    component.sourceName = 'fruit';
    // 上記変更を反映
    fixture.detectChanges();
    // service の query 待ち
    tick(1);
    // 内部の値の変更を反映
    fixture.detectChanges();
    expect(component.formControl.value).toEqual(SET_VALUE_FOR_CONTROL);
    component.formControl.reset();
    tick();
    expect(component.formControl.value).toEqual(2);
    expect(fixture.debugElement.query(By.css('option:checked')).nativeElement.textContent).toBe('orange');
  }));
});
