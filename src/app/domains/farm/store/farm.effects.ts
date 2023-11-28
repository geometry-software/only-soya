import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs'
import { RecipeActions as ItemActions } from './farm.actions'
import { FarmEntityService } from '../services/farm.service'
import { Recipe, RecipeStatus } from '../utils/farm.model'
import { Router } from '@angular/router'
import { ConfirmationService } from 'src/app/shared/services/confirmation.service'
import { FormConstants } from '../utils/farm.constants'
import { formatRequest } from '../../../shared/utils/format-request'
import { Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './farm.selectors'

@Injectable()
export class RecipeEffects {
  constructor(
    private router: Router,
    private actions$: Actions,
    private store$: Store,
    private entityService: FarmEntityService,
    private confirmationService: ConfirmationService
  ) {}

  readonly moduleUrl = FormConstants.moduleUrl
  readonly deleteTitle = FormConstants.deleteTitle
  readonly defaultCreateStatus = FormConstants.defaultCreateStatus

  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.createItem),
      mergeMap(({ item }) =>
        this.entityService.create<Recipe>(item).pipe(
          mergeMap((response) =>
            this.entityService.getTotalByStatus<RecipeStatus>(this.defaultCreateStatus).pipe(
              map((total) => {
                // TODO: add notification through service
                // this.notificationService.notifyCreateSuccess('message)
                this.router.navigate([this.moduleUrl, response.id])
                return ItemActions.createItemSuccess({ response, total })
              }),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
            )
          )
        )
      )
    )
  )

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.updateItem),
      mergeMap(({ item, id }) =>
        this.entityService.update<Recipe>(item, id).pipe(
          map(() => {
            // TODO: add notification through service
            // this.notificationService.notifyEditSuccess('message)
            this.router.navigate([this.moduleUrl, id])
            return ItemActions.updateItemSuccess()
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
        this.entityService.getById<Recipe>(id).pipe(
          map((item) => ItemActions.getItemSuccess({ item })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  getItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItems),
      withLatestFrom(this.store$.select(getResetRequestToTheFirstPage), this.store$.select(getItemsPageAmount)),
      mergeMap(([{ request }, resetRequest, pageAmount]) => {
        const { size, item, query, order, status } = formatRequest<Recipe, RecipeStatus>(request, resetRequest)
        switch (query) {
          case 'all':
            return this.entityService.getAll<Recipe>().pipe(
              mergeMap((items) =>
                this.entityService
                  .getTotalByStatus<RecipeStatus>(status)
                  .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'all', total })))
              ),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
            )
          case 'first':
            return this.entityService.getFirstPage<Recipe, RecipeStatus>(order, size, status).pipe(
              mergeMap((items) =>
                this.entityService
                  .getTotalByStatus<RecipeStatus>(status)
                  .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'first', total })))
              ),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
            )
          case 'next':
            return this.entityService
              .getNextPage<Recipe, RecipeStatus, typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'next', size: pageAmount })),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'previous':
            return this.entityService
              .getPreviousPage<Recipe, RecipeStatus, typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'previous', size: pageAmount })),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'custom':
            return of(ItemActions.getItemsSuccess({ items: null, query: 'custom' }))
        }
      })
    )
  )

  getItemsBySearchQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItemsBySearchQuery),
      mergeMap(({ request }) =>
        this.entityService.getAllByQuery<Recipe>(request.key, request.value).pipe(
          map((items) => ItemActions.getItemsSuccess({ items, query: 'custom', total: items.length })),
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
