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

export interface SelectorServiceMap {
  map: Map<string, SelectorService>;
}

export const MULTI_IMPORT_SERVICES_MAP = new InjectionToken<SelectorServiceMap>('MULTI_IMPORT_SERVICES_MAP');

@Injectable()
export class EmptySelectorServiceMap {
  public map;
  constructor() {
    this.map = new Map();
  }
}
