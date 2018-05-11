/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AfcSingleCheckboxComponent } from './single-checkbox.component';
import { AfcValidateMessageComponent } from './validate-message.component';
import { NoopErrorMessageFactoryService, ERROR_MESSAGE_FACTORY_SERVICE } from '../services';

describe('AfcSingleCheckboxComponent', () => {
  let component: AfcSingleCheckboxComponent;
  let fixture: ComponentFixture<AfcSingleCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AfcSingleCheckboxComponent,
        AfcValidateMessageComponent,
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [{
        provide: ERROR_MESSAGE_FACTORY_SERVICE,
        useClass: NoopErrorMessageFactoryService,
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfcSingleCheckboxComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
