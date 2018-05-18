import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  AfcInputComponent,
  AfcNumberComponent,
  AfcCheckboxComponent,
  AfcRadioComponent,
  AfcSelectComponent,
  AfcSelect2Component,
  AfcSingleCheckboxComponent,
  AfcTextareaComponent,
  AfcValidateMessageComponent,
} from './components';
import {
  NoopErrorMessageFactoryService,
  ERROR_MESSAGE_FACTORY_SERVICE,
  NoopSelectorServiceInjector,
  SELECTOR_SERVICE_INJECTOR,
} from './services';

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
    NoopSelectorServiceInjector,
    {
      provide: ERROR_MESSAGE_FACTORY_SERVICE,
      useClass: NoopErrorMessageFactoryService,
    }, {
      provide: SELECTOR_SERVICE_INJECTOR,
      useClass: NoopSelectorServiceInjector,
    }
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class NgFormComponentsModule { }
