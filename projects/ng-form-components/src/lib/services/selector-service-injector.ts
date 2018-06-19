import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface SelectorItem {
  name: string;
  value: string|number;
  default: boolean;
  sort?: string|number;
}

export abstract class Selectable {
  get forSelectName(): string { throw new Error('unimplemented'); }
  get forSelectValue(): any { throw new Error('unimplemented'); }
  get forSelectDefault(): boolean {
    return false;
  }
  get forSelectOrder(): any { throw new Error('unimplemented'); }
}

export interface SelectorService {
  list(): Observable<Selectable[]>;
  query(_: any): void;
}

export interface SelectorServiceInjector {
  get(name: string): SelectorService|null;
}

export const SELECTOR_SERVICE_INJECTOR = new InjectionToken<SelectorServiceInjector>('SELECTOR_SERVICE_INJECTOR');

@Injectable()
export class NoopSelectorServiceInjector implements SelectorServiceInjector {
  constructor() {}
  get(name: string) {
    return null;
  }
}
