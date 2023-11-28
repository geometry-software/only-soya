import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { AuthActions as ItemActions } from '../../store/auth.actions'
import { Observable, shareReplay } from 'rxjs'
import { CdkTableDataSourceInput } from '@angular/cdk/table'
import { AuthStatus, AuthUser } from '../../utils/auth.model'
import { Store } from '@ngrx/store'
import { getItems, getItemsLoadingState, getListLabels } from '../../store/auth.selectors'
import { AuthConstants } from '../../utils/auth.constants'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { SignalService } from 'src/app/shared/services/signal.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  // Selectors
  readonly userList$: Observable<CdkTableDataSourceInput<AuthUser>> = this.store$.select(getItems).pipe(shareReplay(1))
  readonly listLabels$ = this.store$.select(getListLabels)
  readonly downloadState$: Observable<boolean> = this.store$.select(getItemsLoadingState)

  readonly defaultFirstPageRequest = AuthConstants.defaultFirstPageRequest
  readonly tableColumns = AuthConstants.tableColumns
  readonly statusListCustomer = AuthConstants.statusListCustomer
  readonly statusListCafe = AuthConstants.statusListCafe
  readonly statusListBlocked = AuthConstants.statusListBlocked

  constructor(private store$: Store, private signalService: SignalService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.initData()
    this.setSignals()
  }

  initData() {
    this.store$.dispatch(ItemActions.getItems({ request: this.defaultFirstPageRequest }))
    this.store$.dispatch(ItemActions.getUsersTotalAmount())
  }

  setSignals() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }

  update(gridStatus: AuthStatus, updateStatus: string, item: AuthUser) {
    switch (gridStatus) {
      case 'requested':
        switch (updateStatus as AuthStatus) {
          case 'customer':
            break
          case 'blocked':
            this.updateStatus(item, 'blocked')
            break
        }
        break

      // default:
      //   break
    }
  }

  changeUserList(event: MatTabChangeEvent) {}

  updateStatus(item: AuthUser, status: AuthStatus) {
    this.store$.dispatch(ItemActions.updateUserStatus({ item, status }))
  }
}
