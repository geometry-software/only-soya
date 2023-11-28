import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { PlateConstants } from '../../utils/plate.constants'
import { Observable, debounceTime, tap } from 'rxjs'
import { Store, select } from '@ngrx/store'
import { getItemId, getLayoutLoading } from '../../store/plate.selectors'
import { PlateActions as ItemActions } from '../../store/plate.actions'

@Component({
  selector: 'app-plate-layout',
  templateUrl: './plate-layout.component.html',
  styleUrls: ['./plate-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlateLayoutComponent implements OnInit {
  // DI
  readonly store$: Store = inject(Store)

  // Selectors
  itemId$: Observable<string> = this.store$.pipe(select(getItemId))
  layoutLoading$: Observable<boolean> = this.store$.pipe(select(getLayoutLoading))

  // Other properties
  readonly searchControl = new FormControl()
  readonly moduleUrl = PlateConstants.moduleUrl
  readonly backTitle = PlateConstants.paginationTitle
  readonly backToListButton = PlateConstants.backToListButton
  readonly searchPlaceholder = PlateConstants.searchPlaceholder
  readonly defaultSearchKey = PlateConstants.defaultSearchKey
  readonly defaultFirstPageRequest = PlateConstants.defaultFirstPageRequest

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
