/* tslint:disable:no-unused-variable */
import { async, tick, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { FilterService } from './filter.service';

export class DummyItem {
    constructor(
        private id: number,
        private name: string,
    ) {}
}

describe('FilterService', () => {
  const list = [
    new DummyItem(1, 'apple'),
    new DummyItem(2, 'orange'),
    new DummyItem(3, 'banana'),
    new DummyItem(4, 'pine apple'),
    new DummyItem(5, 'みかん'),
    new DummyItem(6, 'もも'),
  ];
  const firstForm = new FormControl();
  const secondForm = new FormControl();
  const thirdForm = new FormControl();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterService
      ],
    });
    firstForm.setValue(null);
    secondForm.setValue(null);
  });

  it('should be filtered by match', (async() => {
    const filter = FilterService.match(firstForm, 'name');
    firstForm.setValue('apple');
    const filteredList = filter.filter(list);
    expect(filteredList.length).toEqual(2);
  }));

  it('should be filtered by equal', (async() => {
    const filter = FilterService.equal(firstForm, 'name');
    firstForm.setValue('apple');
    const filteredList = filter.filter(list);
    expect(filteredList.length).toEqual(1);
  }));

  it('should be filtered by graterThan', (async() => {
    const filter = FilterService.graterThan(firstForm, 'id');
    firstForm.setValue(4);
    const filteredList = filter.filter(list);
    expect(filteredList.length).toEqual(2);
  }));

  it('should be filtered by over', (async() => {
    const filter = FilterService.over(firstForm, 'id');
    firstForm.setValue(4);
    const filteredList = filter.filter(list);
    expect(filteredList.length).toEqual(3);
  }));

  it('should be filtered by lessThan', (async() => {
    const filter = FilterService.lessThan(firstForm, 'id');
    firstForm.setValue(1);
    const filteredList = filter.filter(list);
    expect(filteredList.length).toEqual(0);
  }));

  it('should be filtered only by under', (async() => {
    const filter = FilterService.under(firstForm, 'id');
    firstForm.setValue(1);
    const filteredList = filter.filter(list);
    expect(filteredList.length).toEqual(1);
  }));

  it('should be filtered by match and over', (async() => {
    const filter = FilterService.match(firstForm, 'name').and(FilterService.over(secondForm, 'id'));
    firstForm.setValue('apple');
    secondForm.setValue(2);
    const filteredList = filter.filter(list);
    expect(filteredList.length).toEqual(1);
  }));

  it('should be filtered by equal or over', (async() => {
    const filter = FilterService.equal(firstForm, 'name').or(FilterService.over(secondForm, 'id'));
    firstForm.setValue('apple');
    secondForm.setValue(3);
    const filteredList = filter.filter(list);
    expect(filteredList.length).toEqual(5);
  }));

  it('should be filtered by equal or (equal and match)', (async() => {
    const filter = FilterService.equal(firstForm, 'id')
        .or(
            FilterService.over(secondForm, 'id')
            .and(FilterService.match(thirdForm, 'name'))
        );
    firstForm.setValue(2);
    secondForm.setValue(3);
    thirdForm.setValue('apple');
    const filteredList = filter.filter(list);
    expect(filteredList.length).toEqual(2);
  }));

});
