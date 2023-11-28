import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, forkJoin, map, mergeMap, of, tap, withLatestFrom } from 'rxjs'
import { AuthActions as ItemActions } from './auth.actions'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { getItemsPageAmount, getResetRequestToTheFirstPage } from './auth.selectors'
import { AuthEntityService } from '../services/auth.service'
import { AuthConstants } from '../utils/auth.constants'
import { AuthStatus, AuthUser } from '../utils/auth.model'
import { formatRequest } from 'src/app/shared/utils/format-request'
import { formatAuthUser } from '../utils/format-auth-user'
import { ConfirmationService } from 'src/app/shared/services/confirmation.service'

@Injectable()
export class AuthEffects {
  constructor(
    private router: Router,
    private actions$: Actions,
    private store$: Store,
    private entityService: AuthEntityService,
    private confirmationService: ConfirmationService
  ) {}

  readonly moduleUrl = AuthConstants.moduleUrl
  readonly blockTitle = AuthConstants.blockTitle
  readonly defaultCreateStatus = AuthConstants.defaultCreateStatus
  readonly defaultFirstPageRequest = AuthConstants.defaultFirstPageRequest

  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.loginWithGoogle),
      mergeMap(() =>
        this.entityService.loginWithGoogle().pipe(
          map(({ additionalUserInfo, user }) => ItemActions.verifyAuthUser({ additionalUserInfo, uid: user.uid })),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
        )
      )
    )
  )

  loginWithFacebook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.loginWithFacebook),
      mergeMap(() =>
        this.entityService
          .loginWithFacebook()
          .pipe(tap((value) => console.log(value)))
          .pipe(
            map(({ additionalUserInfo, user }) => ItemActions.verifyAuthUser({ additionalUserInfo, uid: user.uid })),
            catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
          )
      )
    )
  )

  verifyAuthUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.verifyAuthUser),
      mergeMap(({ additionalUserInfo, uid }) => {
        console.log(additionalUserInfo)
        const item = formatAuthUser(additionalUserInfo.profile, uid, additionalUserInfo.providerId)
        console.log(item)

        if (additionalUserInfo?.isNewUser) {
          return this.entityService.create<AuthUser>(item, uid).pipe(
            map(() => {
              // TODO: add notification through service
              // this.notificationService.notifyCreateSuccess('message)
              // this.router.navigate([this.moduleUrl, response.id])
              return ItemActions.createUserSuccess({ item })
            }),
            catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
          )
        } else {
          console.log('has auth')
          return this.entityService.update<AuthUser>({ status: 'requested' }, uid).pipe(
            map(() => {
              // TODO: add notification through service
              // this.notificationService.notifyCreateSuccess('message)
              // this.router.navigate([this.moduleUrl, response.id])
              return ItemActions.updateUserSuccess({ item })
            }),
            catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
          )
        }
      })
    )
  )

  getUsersTotalAmount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getUsersTotalAmount),
      mergeMap(() =>
        forkJoin([
          this.entityService.getTotalByStatus<AuthStatus>('cafe'),
          this.entityService.getTotalByStatus<AuthStatus>('customer'),
          this.entityService.getTotalByStatus<AuthStatus>('blocked'),
        ]).pipe(
          map(([cafe, customer, blocked]) =>
            ItemActions.getUsersTotalAmountSuccess({
              response: {
                cafe: cafe,
                customer: customer,
                blocked: blocked,
              },
            })
          ),
          catchError((error) => of(ItemActions.notifyError({ error, errorType: 'edit' })))
        )
      )
    )
  )

  updateUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.updateUserStatus),
      mergeMap(({ item }) =>
        this.confirmationService.defaultConfirm(this.blockTitle, item.name).pipe(
          mergeMap(() =>
            this.entityService.updateStatus<AuthStatus>('blocked', item.uid).pipe(
              map(() => ItemActions.updateUserStatusSuccess()),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'edit' })))
            )
          )
        )
      )
    )
  )

  updateUserStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.updateUserStatusSuccess),
      mergeMap(() => of(ItemActions.getUsersTotalAmount(), ItemActions.getItems({ request: this.defaultFirstPageRequest })))
    )
  )

  // updateUserStatus$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ItemActions.updateUserStatus),
  //     mergeMap(({ item, status }) =>
  //       this.entityService
  //         .update<AuthUser>({ status: status }, item.uid)
  //         .pipe(
  //           map(() => ItemActions.updateUserStatusSuccess()),
  //           catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
  //         )
  //     )
  //   )
  // )

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ItemActions.logOut),
        mergeMap(() => this.entityService.logout().pipe(map(() => this.router.navigate(['login/profile']))))
      ),
    { dispatch: false }
  )

  // createItem$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ItemActions.createItem),
  //     mergeMap(({ item }) =>
  //       this.entityService.create<AuthUser>(item).pipe(
  //         mergeMap((response) =>
  //           this.entityService.getTotalByStatus<AuthStatus>(this.defaultCreateStatus).pipe(
  //             map((total) => {
  //               // TODO: add notification through service
  //               // this.notificationService.notifyCreateSuccess('message)
  //               this.router.navigate([this.moduleUrl, response.id])
  //               return ItemActions.createItemSuccess({ response, total })
  //             }),
  //             catchError((error) => of(ItemActions.notifyError({ error, errorType: 'create' })))
  //           )
  //         )
  //       )
  //     )
  //   )
  // )

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.updateItem),
      mergeMap(({ item, id }) =>
        this.entityService.update<AuthUser>(item, id).pipe(
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

  getItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.getItem),
      mergeMap(({ id }) =>
        this.entityService.getById<AuthUser>(id).pipe(
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
        const { size, item, query, order, status } = formatRequest<AuthUser, AuthStatus>(request, resetRequest)
        switch (query) {
          case 'all':
            return this.entityService.getAll<AuthUser>().pipe(
              mergeMap((items) =>
                this.entityService
                  .getTotalByStatus<AuthStatus>(status)
                  .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'all', total })))
              ),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
            )
          case 'first':
            return this.entityService.getFirstPage<AuthUser, AuthStatus>(order, size, status).pipe(
              mergeMap((items) =>
                this.entityService
                  .getTotalByStatus<AuthStatus>(status)
                  .pipe(map((total) => ItemActions.getItemsSuccess({ items, query: 'first', total })))
              ),
              catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
            )
          case 'next':
            return this.entityService
              .getNextPage<AuthUser, AuthStatus, typeof order.key>(order, size, status, item[order.key])
              .pipe(
                map((items) => ItemActions.getItemsSuccess({ items, query: 'next', size: pageAmount })),
                catchError((error) => of(ItemActions.notifyError({ error, errorType: 'list' })))
              )
          case 'previous':
            return this.entityService
              .getPreviousPage<AuthUser, AuthStatus, typeof order.key>(order, size, status, item[order.key])
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
        this.entityService.getAllByQuery<AuthUser>(request.key, request.value).pipe(
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
