/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AfcInputComponent } from './input.component';
import { AfcValidateMessageComponent } from './validate-message.component';
import { NoopErrorMessageFactoryService, ERROR_MESSAGE_FACTORY_SERVICE } from '../services';

describe('AfcInputComponent', () => {
  let component: AfcInputComponent;
  let fixture: ComponentFixture<AfcInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AfcInputComponent,
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
    fixture = TestBed.createComponent(AfcInputComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
