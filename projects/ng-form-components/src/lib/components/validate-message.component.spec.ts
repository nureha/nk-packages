/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { AfcValidateMessageComponent } from './validate-message.component';
import { NoopErrorMessageFactoryService, ERROR_MESSAGE_FACTORY_SERVICE } from '../services';

describe('AfcValidateMessageComponent', () => {
  let component: AfcValidateMessageComponent;
  let fixture: ComponentFixture<AfcValidateMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AfcValidateMessageComponent],
      providers: [{
        provide: ERROR_MESSAGE_FACTORY_SERVICE,
        useClass: NoopErrorMessageFactoryService,
      }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfcValidateMessageComponent);
    component = fixture.componentInstance;
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
