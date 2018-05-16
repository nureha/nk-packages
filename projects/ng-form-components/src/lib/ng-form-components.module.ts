import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AfcInputComponent } from './components/input.component';
import { AfcNumberComponent } from './components/number.component';
import { AfcCheckboxComponent, AfcRadioComponent, AfcSelectComponent, AfcSelect2Component } from './components/select';
import { AfcSingleCheckboxComponent } from './components/single-checkbox.component';
import { AfcTextareaComponent } from './components/textarea.component';
import { AfcValidateMessageComponent } from './components/validate-message.component';
import { NoopErrorMessageFactoryService, ERROR_MESSAGE_FACTORY_SERVICE, EmptySelectorServiceMap, MULTI_IMPORT_SERVICES_MAP } from './services';

const COMPONENTS = [
  AfcInputComponent,
  AfcNumberComponent,
  AfcCheckboxComponent,
  AfcRadioComponent,
  AfcSelectComponent,
  AfcSelect2Component,
  AfcSingleCheckboxComponent,
  AfcTextareaComponent,
  AfcValidateMessageComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
  {
    provide: ERROR_MESSAGE_FACTORY_SERVICE,
    useClass: NoopErrorMessageFactoryService,
  }, {
    provide: MULTI_IMPORT_SERVICES_MAP,
    useClass: EmptySelectorServiceMap,
  }],
  declarations: [...COMPONENTS],
  exports:[...COMPONENTS]
})
export class NgFormComponentsModule { }
