import { Component, OnInit, OnDestroy, Input, Inject, InjectionToken } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorMessageFactoryService, ERROR_MESSAGE_FACTORY_SERVICE } from '../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'afc-validate-message',
  template: `
    <div>
      <span class="validation-errors" *ngIf="control.touched && control.invalid">
        <ng-content></ng-content>
        <p *ngFor="let m of messages">{{ m }}</p>
      </span>
    </div>
  `,
  styles: [`
    div {
      position: relative;
    }
  `, `
    span.validation-errors {
      position: absolute;
      color: #ffffff;
      bottom: 70%;
      right: -20px;
      padding: 7px;
      background-color: #bd362f;
      border-radius: 7px;
      z-index: 10000;
    }
  `, `
    span.validation-errors:before {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -7px;
      border: 7px solid transparent;
      border-top: 7px solid #bd362f;
      z-index: 10000;
    }
  `, `
    p {
      margin: 0;
      padding: 0;
    }
  `]
})
export class AfcValidateMessageComponent implements OnInit, OnDestroy {

  @Input() control: FormControl;
  @Input() name = '';
  private subscription = new Subscription();

  public messages: string[] = [];

  constructor(
    @Inject(ERROR_MESSAGE_FACTORY_SERVICE) private messageFactoryService: ErrorMessageFactoryService,
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.control.valueChanges.subscribe(v => {
        if (this.control.errors) {
          this.messages = this.messageFactoryService.create(this.control.errors, this.name);
        }
      })
    );
    if (this.control.errors) {
      this.messages = this.messageFactoryService.create(this.control.errors, this.name);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
