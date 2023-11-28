import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, forkJoin, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { CustomeActions as ItemActions } from './customer.actions'
import { CustomerEntityService } from '../services/customer.service'
import { Customer, CustomerMenuTotalResponse, CustomerStatus } from '../utils/customer.model'
import { Router } from '@angular/router'
import { ConfirmationService } from 'src/app/shared/services/confirmation.service'
import { CustomerConstants } from '../utils/customer.constants'
import { Store } from '@ngrx/store'
import { getPlateTypes, getResetRequestToTheFirstPage } from './customer.selectors'
import { NotificationService } from 'src/app/shared/services/notification.service'
import { PlateEntityService } from '../../plate/services/plate.service'
import { formatRequest } from '../utils/format-customer-request'
import { PlateType } from '../../plate/utils/plate.model'
import { transformPlateTypes } from '../utils/transform-plate-types'

@Injectable()
export class CustomerEffects {
  constructor(
    private router: Router,
    private actions$: Actions,
    private store$: Store,
    private customerEntityService: CustomerEntityService,
    private plateEntityService: PlateEntityService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ) {}

  readonly moduleUrl = CustomerConstants.moduleUrl
  readonly deleteTitle = CustomerConstants.deleteTitle
  readonly defaultCreateStatus = CustomerConstants.defaultCreateStatus
  readonly notifyCreateSuccessMessage = CustomerConstants.notifyCreateSuccessMessage
  readonly notifyEditSuccessMessage = CustomerConstants.notifyEditSuccessMessage

  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.createItem),
      switchMap(({ item }) =>
        this.customerEntityService.create<Customer>(item).pipe(
          map((response) => {
            this.notificationService.notifySuccess(this.notifyCreateSuccessMessage)
            this.router.navigate([this.moduleUrl, response.id])
            return ItemActions.createItemSuccess()
          }),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.updateItem),
      mergeMap(({ item, id }) =>
        this.customerEntityService.update<Customer>(item, id).pipe(
          map(() => {
            this.notificationService.notifySuccess(this.notifyEditSuccessMessage)
            this.router.navigate([this.moduleUrl, id])
            return ItemActions.createItemSuccess()
          }),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'edit' })))
        )
      )
    )
  )

  deleteItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.deleteItem),
      mergeMap(({ id }) =>
        this.confirmationService.defaultConfirm(this.deleteTitle).pipe(
          mergeMap(() =>
            this.customerEntityService.delete(id).pipe(
              map(() => ItemActions.deleteItemSuccess()),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'edit' })))
            )
          )
        )
      )
    )
  )

  deleteItemSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ItemActions.deleteItemSuccess),
        mergeMap(() => this.router.navigate([this.moduleUrl]))
      ),
    { dispatch: false }
  )

  getItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItem),
      mergeMap(({ id }) =>
        this.customerEntityService.getById<Customer>(id).pipe(
          map((item) => ItemActions.getItemSuccess({ item })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  getItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItems),
      withLatestFrom(this.store$.select(getResetRequestToTheFirstPage), this.store$.select(getPlateTypes)),
      mergeMap(([{ request }, resetRequest, plateTypes]) => {
        const { size, item, query, order, status, plateType, plateCategory } = formatRequest(request, resetRequest)
        const types = transformPlateTypes(plateTypes, plateType)
        switch (query) {
          case 'first':
            if (plateCategory === 'all') {
              return forkJoin([
                this.customerEntityService.getAll<Customer, CustomerStatus>(order, size, status, types),
                this.customerEntityService.getJoinedListLabelAmount(),
              ]).pipe(
                map(([items, listLabelAmount]) =>
                  ItemActions.getItemsSuccess({ items, query: 'first', listLabelAmount, plateTypes: types })
                ),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
            } else {
              return forkJoin([
                this.customerEntityService.getFirstPage<Customer, CustomerStatus>(order, size, status, plateCategory, types),
                this.customerEntityService.getJoinedListLabelAmount(),
              ]).pipe(
                map(([items, listLabelAmount]) =>
                  ItemActions.getItemsSuccess({ items, query: 'first', listLabelAmount, plateTypes: types })
                ),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
            }
          case 'next':
            return this.plateEntityService
              .getNextPage<Customer, CustomerStatus, typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'next' })),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'custom':
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
          case 'all':
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
          case 'previous':
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
        }
      })
    )
  )

  getItemsBySearchQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      mergeMap(({ request }) =>
        this.plateEntityService.getAllByQuery<Customer>(request.key, request.value).pipe(
          map((items) => ItemActions.getItemsSuccess({ items, query: 'custom' })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
        )
      )
    )
  )

  notifyError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ItemActions.notifyError),
        tap(({ error }) => console.error(error))
        // mergeMap(() => of(this.notificationService.notifyError()))
      ),
    { dispatch: false }
  )
}
