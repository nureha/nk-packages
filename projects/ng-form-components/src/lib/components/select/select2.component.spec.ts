/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AfcSelect2Component } from './select2.component';
import { AfcValidateMessageComponent } from '../validate-message.component';
import { SELECTOR_SERVICE_INJECTOR, NoopSelectorServiceInjector, ERROR_MESSAGE_FACTORY_SERVICE, NoopErrorMessageFactoryService } from '../../services';

describe('AfcSelect2Component', () => {
  let component: AfcSelect2Component;
  let fixture: ComponentFixture<AfcSelect2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AfcSelect2Component,
        AfcValidateMessageComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
      {
        provide: ERROR_MESSAGE_FACTORY_SERVICE,
        useClass: NoopErrorMessageFactoryService,
      }, {
        provide: SELECTOR_SERVICE_INJECTOR,
        useClass: NoopSelectorServiceInjector
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfcSelect2Component);
    component = fixture.componentInstance;
    component.sourceName = 'list';
    component.list = [];
    component.formControl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
