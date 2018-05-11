/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AfcNumberComponent } from './number.component';
import { AfcValidateMessageComponent } from './validate-message.component';
import { NoopErrorMessageFactoryService, ERROR_MESSAGE_FACTORY_SERVICE } from '../services';

describe('AfcNumberComponent', () => {
  let component: AfcNumberComponent;
  let fixture: ComponentFixture<AfcNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AfcNumberComponent,
        AfcValidateMessageComponent
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
    fixture = TestBed.createComponent(AfcNumberComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
