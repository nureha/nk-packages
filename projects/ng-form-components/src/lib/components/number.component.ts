import {
  Component, OnInit, AfterViewInit, Input, Output, EventEmitter,
  forwardRef, Renderer2, ElementRef, HostListener
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators } from '@angular/forms';

function moveDigit(decimal: number, moves: number): number {
  const nums = (decimal || 0).toString().split('.');
  let prefix = '';
  if (/^-/.test(nums[0])) {
    prefix = '-';
    nums[0] = nums[0].substring(1);
  }
  // 小数が 0.0e-00 形式だった場合
  if (nums[1] && /e-/.test(nums[1])) {
    const _nums1 = nums[1].split('e-');
    nums[1] = '0.';
    for (let i = 1; i < parseInt(_nums1[1], 10); ++i) {
      nums[1] += '0';
    }
    nums[1] += _nums1[0].replace('.', '');
  }
  // 正の変換
  if (moves > 0) {
    // もともと整数だった場合
    if (!nums[1]) {
      return decimal * Math.pow(10, moves);
    }
    // 計算結果が整数になる場合
    if (nums[1].length <= moves) {
      return parseInt(prefix + nums[0] + nums[1], 10) * Math.pow(10, (moves - nums[1].length));
    }
    // それ以外の場合
    return parseFloat(prefix + nums[0] + nums[1].substr(0, moves) + '.' + nums[1].substr(moves, (nums[1].length - moves)));
  // 負の変換
  } else {
    let base = '0.';
    if (nums[0] === '0') {
      for (let i = 0; i > moves; --i) {
        base += '0';
      }
      return parseFloat(prefix + base + nums[1]);
    }
    // 計算結果が1より小さくなる場合
    if (nums[0].length <= -moves) {
      for (let i = 0; i > (moves + nums[0].length); --i) {
        base += '0';
      }
      return parseFloat(prefix + base + nums[0] + nums[1]);
    }
    // それ以外の場合
    return parseFloat(prefix + nums[0].substr(0, nums[0].length + moves) + '.' + nums[0].substr(nums[0].length + moves, -moves) + nums[1]);
  }
}

function numberFormat(num, underPoint = -1): string {
  if (typeof num === 'object') {
    return '';
  }
  if (underPoint > -1) {
    num = moveDigit(Math.round(moveDigit(num, underPoint)), -underPoint);
  }
  return num.toString().split('.').map((str, index) => {
    return index > 0 ? str : str.split('').reverse()
      .map((s, i) => s += i && (i % 3 === 0) && s !== '-' ? ',' : '')
      .reverse().join('');
  }).join('.');
}

@Component({
  selector: 'afc-number',
  template: `
    <label *ngIf="label"><span *ngIf="required">*&nbsp;</span>{{ label }}</label>
    <afc-validate-message [control]="formControl" [name]="label"><ng-content></ng-content></afc-validate-message>
    <input class="form-control"
      (blur)="onBlur()"
      type="number" [formControl]="innerFormControl">
    <input class="form-control" (focus)="onFocus()" [readonly]="readonly">
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AfcNumberComponent),
    multi: true
  }]
})
export class AfcNumberComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input() formControl: FormControl;
  @Input() label: string;
  @Input() type = 'number'; // number|percent
  @Input() afterPointNum = 2;
  @Input() set readonly(flag: boolean) {
    this._readonly = flag;
    this.onBlur(true);
  }
  @Output() blur = new EventEmitter();
  get readonly() {
    return this._readonly;
  }
  public innerType: string;
  public required: boolean;
  public innerFormControl: FormControl = new FormControl();
  get formatedValue() {
    if (this.type === 'percent') {
      return numberFormat(this.innerFormControl.value) + '%';
    }
    return numberFormat(this.innerFormControl.value);
  }
  private _readonly = false;
  private realInput: any;
  private dummyInput: any;

  onChangePropagate: any = () => {};

  @HostListener('keydown', ['$event.key'])
  onKeyDown(key) {
    switch (key) {
      case 't':
        this.innerFormControl.patchValue(moveDigit(this.innerFormControl.value, 3));
        break;
      case 'm':
        this.innerFormControl.patchValue(moveDigit(this.innerFormControl.value, 6));
        break;
    }
  }

  constructor(
    private renderer: Renderer2,
    private elm: ElementRef
  ) {}

  ngOnInit() {
    const err = this.formControl.validator && this.formControl.validator(new FormControl());
    this.required = !!err && !!err['required'];
    this.innerFormControl.setValidators(this.formControl.validator);
    const inputs = Array.prototype.filter.call(this.elm.nativeElement.childNodes, c => c.nodeName === 'INPUT');
    this.realInput = inputs[0];
    this.dummyInput = inputs[1];
    this.innerFormControl.valueChanges.subscribe(v => {
      if (this.type === 'percent') {
        v = moveDigit(v, -this.afterPointNum);
      }
      if (v !== this.formControl.value) {
        this.onChangePropagate(v);
      }
    });
  }

  ngAfterViewInit() {
    this.onBlur(true);
  }

  onBlur(noEmit = false) {
    if (this.realInput) {
      if (this.innerFormControl.value === '') {
        this.innerFormControl.patchValue(0);
      }
      this.renderer.setStyle(this.realInput, 'display', 'none');
      this.renderer.setStyle(this.dummyInput, 'display', 'inherit');
      this.renderer.setProperty(this.dummyInput, 'value', this.formatedValue);
    }
    if (!noEmit) {
      this.blur.emit();
    }
  }

  onFocus() {
    if (!this.readonly) {
      this.renderer.setStyle(this.dummyInput, 'display', 'none');
      this.renderer.setStyle(this.realInput, 'display', 'inherit');
      if (this.innerFormControl.value === 0) {
        this.innerFormControl.patchValue('');
      }
      if (this.elm.nativeElement['fucus']) {
        this.elm.nativeElement['fucus']();
      }
    }
  }

  writeValue(value: number) {
    if (this.type === 'percent') {
      value = moveDigit(value, this.afterPointNum);
    }
    this.innerFormControl.patchValue(value);
    this.renderer.setProperty(this.dummyInput, 'value', this.formatedValue);
  }
  registerOnChange(fn: any) {
    this.onChangePropagate = fn;
  }
  registerOnTouched(_: any) {}

}
