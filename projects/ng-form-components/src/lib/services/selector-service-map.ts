import { Injectable, InjectionToken } from '@angular/core';
import { SelectorService } from './selector-service-injector';

export interface SelectorServiceMap {
    map: Map<string, SelectorService>;
}

export const MULTI_IMPORT_SERVICES_MAP = new InjectionToken<SelectorServiceMap>('MULTI_IMPORT_SERVICES_MAP');

@Injectable({
    providedIn: 'root'
})
export class EmptySelectorServiceMap {
    public map;
    constructor() {
        this.map = new Map();
    }
}
