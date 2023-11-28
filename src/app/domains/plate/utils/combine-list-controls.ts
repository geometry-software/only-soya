import { FormControl } from '@angular/forms'
import { Sort } from '@angular/material/sort'
import { Store } from '@ngrx/store'
import { combineLatest, map, skip, startWith, tap } from 'rxjs'
import { PlateActions as ItemActions } from '../store/plate.actions'

export const combineListControls = (
  pagination: FormControl,
  order: FormControl,
  plateType: FormControl,
  plateCategory: FormControl,
  store$: Store
) =>
  combineLatest([
    pagination.valueChanges.pipe(startWith(pagination.value)),
    // size.valueChanges.pipe(
    //   startWith(size.value),
    //   tap(() => store$.dispatch(ItemActions.resetRequestToTheFirstPage()))
    // ),
    order.valueChanges.pipe(
      startWith(order.value),
      tap(() => store$.dispatch(ItemActions.resetRequestToTheFirstPage())),
      map((sort: Sort) => ({ key: sort.active, value: sort.direction ? sort.direction : 'desc' }))
    ),
    plateType.valueChanges.pipe(
      startWith(plateType.value),
      tap(() => store$.dispatch(ItemActions.resetRequestToTheFirstPage()))
    ),
    plateCategory.valueChanges.pipe(
      skip(1),
      startWith(plateCategory.value),
      tap(() => store$.dispatch(ItemActions.resetRequestToTheFirstPage()))
    ),
  ])
