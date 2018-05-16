import { Injectable, Injector, ReflectiveInjector, Inject } from '@angular/core';
import { MULTI_IMPORT_SERVICES_MAP, SelectorService, SelectorServiceMap } from './selector-service-map';

@Injectable()
export class SelectorServiceInjector {

  private providers: SelectorService[];

  constructor(
    private injector: Injector,
    @Inject(MULTI_IMPORT_SERVICES_MAP) private services: SelectorServiceMap,
  ) {
    this.providers = Array.from(this.services.map.values());
  }

  get(name: string): any {
    const _class = this.services.map.get(name);
    if (_class) {
      const injector = ReflectiveInjector.resolveAndCreate(<any[]>this.providers, this.injector);
      return injector.get(_class);
    }
    throw new Error(`${name} is not provided!`);
  }

}
