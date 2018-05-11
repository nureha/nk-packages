import { AbstractControl } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';

export class FilterService {
    public get onChange() {
      return this._onChange;
    }
    private action$ = new Subject();
    private _val: any;
    private _regExp = RegExp('.*');
    private _onChange: Observable<any>;
    private _and: FilterService[] = [];
    private _or: FilterService[] = [];

    static match(form: AbstractControl, target: string): FilterService {
      return new FilterService(form.valueChanges, target, '~');
    }
    static equal(form: AbstractControl, target: string): FilterService {
      return new FilterService(form.valueChanges, target, '=');
    }
    static graterThan(form: AbstractControl, target: string): FilterService {
      return new FilterService(form.valueChanges, target, '>');
    }
    static over(form: AbstractControl, target: string): FilterService {
      return new FilterService(form.valueChanges, target, '>=');
    }
    static lessThan(form: AbstractControl, target: string): FilterService {
      return new FilterService(form.valueChanges, target, '<');
    }
    static under(form: AbstractControl, target: string): FilterService {
      return new FilterService(form.valueChanges, target, '<=');
    }

    constructor(
      private ob: Observable<any>,
      private _target: string,
      private _type: string,
    ) {
      ob.subscribe(v => {
        this._val = v;
        this._regExp = new RegExp(v);
      });
      this._onChange = merge(this.action$, ob);
    }
    private check(item: any): boolean {
      if (!(this._target in item)) {
        return false;
      }
      if (!this._val) {
        return true;
      }
      switch (this._type) {
        case '~':
          return !this._val || this._regExp.test(item[this._target]);
        case '=':
          return item[this._target] === this._val;
        case '>':
          return item[this._target] > this._val;
        case '>=':
          return item[this._target] >= this._val;
        case '<':
          return item[this._target] < this._val;
        case '<=':
          return item[this._target] <= this._val;
        default:
          break;
      }
      return true;
    }
    private checkAll(item: any): boolean {
      return (this._or.length > 0 && this._or.some(s => s.checkAll(item))) ||
          this.check(item) &&
          !this._and.some(s => !s.checkAll(item));
    }
    trigger() {
      this.action$.next(true);
    }
    filter<T>(list: T[]): T[] {
      return list.filter(l => this.checkAll(l));
    }
    and(s: FilterService) {
      this._and.push(s);
      this._onChange = merge(this._onChange, s.onChange);
      return this;
    }
    or(s: FilterService) {
      this._or.push(s);
      this._onChange = merge(this._onChange, s.onChange);
      return this;
    }
  }
