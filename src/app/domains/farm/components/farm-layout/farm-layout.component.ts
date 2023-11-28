import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { FormConstants } from '../../utils/farm.constants'
import { Observable, debounceTime, tap } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { getItemId, getLayoutLoading } from '../../store/farm.selectors'
import { RecipeActions as ItemActions } from '../../store/farm.actions'

@Component({
  selector: 'app-farm-layout',
  templateUrl: './farm-layout.component.html',
  styleUrls: ['./farm-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandOwnerLayoutComponent implements OnInit {
  // DI
  readonly store$: Store = inject(Store)

  // Selectors
  itemId$: Observable<string> = this.store$.pipe(select(getItemId))
  layoutLoading$: Observable<boolean> = this.store$.pipe(select(getLayoutLoading)).pipe(tap((value) => console.log(value)))

  // Other properties
  readonly searchControl = new FormControl()
  readonly moduleUrl = FormConstants.moduleUrl
  readonly backTitle = FormConstants.paginationTitle
  readonly backToListButton = FormConstants.backToListButton
  readonly searchPlaceholder = FormConstants.searchPlaceholder
  readonly defaultSearchKey = FormConstants.defaultSearchKey
  readonly defaultFirstPageRequest = FormConstants.defaultFirstPageRequest

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        tap((value) =>
          value
            ? this.store$.dispatch(
                ItemActions.getItemsBySearchQuery({
                  request: {
                    key: this.defaultSearchKey,
                    value,
                  },
                })
              )
            : this.store$.dispatch(ItemActions.getItems({ request: this.defaultFirstPageRequest }))
        )
      )
      .subscribe()
  }

  deleteItem(id: string) {
    this.store$.dispatch(ItemActions.deleteItem({ id }))
  }
}
