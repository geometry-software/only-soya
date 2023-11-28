import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, forkJoin, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs'
import { PlateActions as ItemActions } from './plate.actions'
import { PlateEntityService } from '../services/plate.service'
import { Plate, PlateStatus } from '../utils/plate.model'
import { Router } from '@angular/router'
import { ConfirmationService } from 'src/app/shared/services/confirmation.service'
import { PlateConstants } from '../utils/plate.constants'
import { Store } from '@ngrx/store'
import { getPlateTypes, getResetRequestToTheFirstPage } from './plate.selectors'
import { NotificationService } from 'src/app/shared/services/notification.service'
import { formatRequest } from '../utils/format-customer-request'
import { transformPlateTypes } from '../../vegi/utils/transform-plate-types'
import { Customer, CustomerStatus } from '../../vegi/utils/customer.model'

@Injectable()
export class PlateEffects {
  constructor(
    private router: Router,
    private actions$: Actions,
    private store$: Store,
    private entityService: PlateEntityService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ) {}

  readonly moduleUrl = PlateConstants.moduleUrl
  readonly deleteTitle = PlateConstants.deleteTitle
  readonly defaultCreateStatus = PlateConstants.defaultCreateStatus
  readonly notifyCreateSuccessMessage = PlateConstants.notifyCreateSuccessMessage
  readonly notifyEditSuccessMessage = PlateConstants.notifyEditSuccessMessage

  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.createItem),
      switchMap(({ item }) =>
        this.entityService.create<Plate>(item).pipe(
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
        this.entityService.update<Plate>(item, id).pipe(
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
            this.entityService.delete(id).pipe(
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
        this.entityService.getById<Plate>(id).pipe(
          map((item) => ItemActions.getItemSuccess({ item })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  getItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ItemActions.getItems),
      withLatestFrom(this.store$.select(getResetRequestToTheFirstPage), this.store$.select(getPlateTypes)),
      mergeMap(([{ request }, resetRequest, plateTypes]) => {
        const { size, item, query, order, status, plateType, plateCategory } = formatRequest(request, resetRequest)
        const types = transformPlateTypes(plateTypes, plateType)
        switch (query) {
          case 'all':
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
          case 'first':
            if (plateCategory === 'all') {
              return forkJoin([
                this.entityService.getAll<Customer, CustomerStatus>(order, size, status, types),
                this.entityService.getJoinedListLabelAmount(),
              ]).pipe(
                map(([items, listLabelAmount]) =>
                  ItemActions.getItemsSuccess({ items, query: 'first', listLabelAmount, plateTypes: types })
                ),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
            } else {
              return forkJoin([
                this.entityService.getFirstPage<Customer, CustomerStatus>(order, size, status, plateCategory, types),
                this.entityService.getJoinedListLabelAmount(),
              ]).pipe(
                map(([items, listLabelAmount]) =>
                  ItemActions.getItemsSuccess({ items, query: 'first', listLabelAmount, plateTypes: types })
                ),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
            }
          case 'next':
            return this.entityService
              .getNextPage<Plate, PlateStatus, typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'next' })),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'custom':
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
          case 'previous':
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
        }
      })
    )
  })

  getItemsBySearchQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      mergeMap(({ request }) =>
        this.entityService.getAllByQuery<Plate>(request.key, request.value).pipe(
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
