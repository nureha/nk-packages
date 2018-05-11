/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AfcTextareaComponent } from './textarea.component';
import { AfcValidateMessageComponent } from './validate-message.component';
import { NoopErrorMessageFactoryService, ERROR_MESSAGE_FACTORY_SERVICE } from '../services';

describe('AfcTextareaComponent', () => {
  let component: AfcTextareaComponent;
  let fixture: ComponentFixture<AfcTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AfcTextareaComponent,
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
    fixture = TestBed.createComponent(AfcTextareaComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
