import { OnInit, OnChanges, OnDestroy, Inject } from '@angular/core';
import { ControlValueAccessor, FormControl, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { combineLatest, share, filter } from 'rxjs/operators';

import { SelectorServiceInjector, SelectorService, Selectable, SelectorItem, SELECTOR_SERVICE_INJECTOR } from '../../services';

class SelectableConstruct extends Selectable implements SelectorItem {
  name: string;
  value: any;
  default: boolean;
  sort: string|number;
  get forSelectName() {
    return this.name;
  }
  get forSelectValue() {
    return this.value;
  }
  get forSelectDefault() {
    return this.default;
  }
  get forSelectOrder() {
    return this.sort;
  }

  constructor(data: SelectorItem) {
    super();
    this.name = data.name;
    this.value = data.value;
    this.default = data.default;
    this.sort = data.sort !== undefined ? data.sort : data.name;
  }
}

class ArrayService implements SelectorService {
  private action$ = new ReplaySubject<Selectable[]>(1);
  constructor() {}
  list() {
    return this.action$.pipe(share());
  }
  query(list: SelectorItem[]) {
    this.action$.next(list.map(l => {
      if (l instanceof Selectable) {
        return l;
      }
      return new SelectableConstruct(l);
    }));
  }
}

let id = 0;

export class AfcSelectBase implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  protected _service: SelectorService;

  /* @Input */ formControl: FormControl;
  /* @Input */ sourceName: string;
  /* @Input */ label: string;
  /* @Input */ valueType: string;
  /* @Input */ list: SelectorItem[] = [];
  /* @Input */ rejects: any[] = [];

  set value(value) {
    this.onChangePropagate(value);
  }

  public data: Selectable[];
  public id: string;
  public required: boolean;
  public get _required() {
    const err = this.formControl.validator && this.formControl.validator(new FormControl());
    this.required = !!err && !!err['required'];
    if (this.required) {
      this.innerFormControl.setValidators(Validators.required);
    } else {
      this.innerFormControl.clearValidators();
    }
    return this.required;
  }
  // valueTypeに関わらずforSelectValueを保持する
  public innerFormControl = new FormControl();
  protected dataPrepared$ = new Subject();
  protected writeValue$ = new Subject();
  protected subscriptions = new Subscription();
  private initialized$ = new Subject();
  private onChangeEventPrepared$ = new Subject();
  private defaultValue: any = null;
  private querySubscription: Subscription;

  onChangePropagate: any = () => {};

  constructor(
    protected injector: SelectorServiceInjector,
  ) {
    this.subscriptions.add(this.dataPrepared$.pipe(filter(v => !!v)).pipe(
      combineLatest(this.initialized$.pipe(filter(v => !!v))),
      combineLatest(this.onChangeEventPrepared$.pipe(filter(v => !!v))),
      combineLatest(this.writeValue$),
    ).subscribe(v => {
        let value = <any>v[1];
        if (value || value === 0) {
          if (typeof value === 'object' && value.forSelectValue) {
            value = value.forSelectValue;
          }
          this.innerFormControl.patchValue(value);
          if (!this.validateInnerFormValue()) {
            this.innerFormControl.patchValue(!this.defaultValue ? this.defaultValue : this.defaultValue.forSelectValue);
          }
        } else if (this.innerFormControl.value || this.innerFormControl.value === 0) {
          this.value = this.innerFormControl.value;
        }
      }));
    this.subscriptions.add(this.dataPrepared$.pipe(filter(v => !!v)).pipe(
      combineLatest(this.initialized$.pipe(filter(v => !!v))),
      combineLatest(this.onChangeEventPrepared$.pipe(filter(v => !!v))),
      combineLatest(this.innerFormControl.valueChanges),
    ).subscribe(v => {
        if (this.data && this.valueType === 'object') {
          v[1] = this.data.find(d => d.forSelectValue === v[1]);
        }
        this.value = v[1];
      }));
  }

  ngOnInit() {
    this.id = '_AfcSelect_' + id.toString();
    id++;
    this.required = this._required;
    this.subscriptions.add(this.observer().subscribe(d => {
      d.sort((a: Selectable, b: Selectable) => {
        if (a.forSelectOrder > b.forSelectOrder) {
          return 1;
        } else if (a.forSelectOrder < b.forSelectOrder) {
          return -1;
        }
        return 0;
      });
      this.defaultValue = null;
      this.data = d.filter(item => {
        return this.rejects.length === 0 || this.rejects.indexOf(item.forSelectValue) === -1;
      }).map(item => {
        if (item.forSelectDefault || this.defaultValue === null) {
          this.defaultValue = item;
        }
        return item;
      });
      this.dataPrepared$.next(true);
      if (!this.validateInnerFormValue()) {
        if (this._required) {
          this.writeValue$.next(!this.defaultValue ? this.defaultValue : this.defaultValue.forSelectValue);
        } else {
          this.value = null;
        }
      }
    }));
    this.query();
    this.initialized$.next(true);
  }

  ngOnChanges(changes) {
    if (
      changes['sourceName'] && changes['sourceName'].currentValue !== changes['sourceName'].previousValue ||
      changes['list'] && changes['list'].currentValue.length !== changes['list'].previousValue.length ||
      changes['rejects'] && changes['rejects'].currentValue.length !== changes['rejects'].previousValue.length
    ) {
      if (this._service) {
        this.query();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  protected query() {
    this.dataPrepared$.next(false);
    const parsed = this._parse(this.sourceName);
    if ((parsed.name === 'list' || parsed.name === 'range') && this.list) {
      this._service.query(this.list);
    } else {
      this._service.query(parsed.query);
    }
  }

  protected existsInSelector(val): boolean {
    if (!val && val !== 0) {
      return false;
    }
    return this.data.some(item => item.forSelectValue === val);
  }

  private observer(): Observable<Selectable[]> {
    if (!this._service) {
      const parsed = this._parse(this.sourceName);
      if (parsed.name === 'list') {
        this._service = new ArrayService();
      } else if (parsed.name === 'range') {
        if (parsed.query['to'] === undefined) {
          throw Error('range.to is required');
        }
        parsed.query['from'] = parseInt((parsed.query['from'] || 0), 10);
        parsed.query['to'] = parseInt((parsed.query['to'] || 0), 10);
        parsed.query['default'] = parseInt((parsed.query['default'] || 0), 10);
        parsed.query['step'] = parseInt((parsed.query['step'] || 1), 10);
        parsed.query['unit'] = parsed.query['unit'] || '';
        this.list = [];
        for (let i = parsed.query['from']; i <= parsed.query['to']; i += parsed.query['step']) {
          this.list.push({
            name: i.toString() + parsed.query['unit'],
            value: i,
            default: i === parsed.query['default'],
          });
        }
        this._service = new ArrayService();
      } else {
        const dataSource = this.injector.get(parsed.name);
        if (!dataSource) {
          throw Error('not exists service: ' + parsed.name);
        }
        this._service = dataSource;
      }
    }
    return this._service.list();
  }

  private _parse(sourceName: string): {name: string, query: Object} {
    const exploded = sourceName.split(':');
    const query = {};
    if (exploded[1]) {
      exploded[1].split('&').forEach(keyValue => {
        const kv = keyValue.split('=');
        if (query[kv[0]] !== undefined) {
          if (!(query[kv[0]] instanceof Array)) {
            query[kv[0]] = [query[kv[0]]];
          }
          query[kv[0]].push(kv[1]);
        } else {
          query[kv[0]] = kv[1];
        }
      });
    }
    return {
      name: exploded[0],
      query: query
    };
  }

  private validateInnerFormValue() {
    return !(
      this._required && !this.innerFormControl.value && this.innerFormControl.value !== 0 ||
      !this.existsInSelector(this.innerFormControl.value) &&
        (!!this.innerFormControl.value || this.innerFormControl.value === 0)
    );
  }

  // for ControlValueAccessor
  writeValue(value: any) {
    if (!this.isEffectiveValue(value) && this._required) {
      if (this.isEffectiveValue(this.defaultValue)) {
        this.writeValue$.next(this.defaultValue.forSelectValue);
      } else if (this.isEffectiveValue(this.innerFormControl.value)) {
        this.writeValue$.next(this.innerFormControl.value);
      }
      return;
    }
    this.writeValue$.next(value);
  }
  registerOnChange(fn: any) {
    this.onChangePropagate = fn;
    this.onChangeEventPrepared$.next(true);
  }
  registerOnTouched(_: any) {}

  private isEffectiveValue(value) {
    return !!value || value === 0;
  }

}
