import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core'
import { FormControl } from '@angular/forms'
import { RecipeConstants } from '../../utils/farm.constants'
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
export class RecipeLayoutComponent implements OnInit {
  // DI
  readonly store$: Store = inject(Store)

  // Selectors
  itemId$: Observable<string> = this.store$.pipe(select(getItemId))
  layoutLoading$: Observable<boolean> = this.store$.pipe(select(getLayoutLoading)).pipe(tap((value) => console.log(value)))

  // Other properties
  readonly searchControl = new FormControl()
  readonly moduleUrl = RecipeConstants.moduleUrl
  readonly backTitle = RecipeConstants.paginationTitle
  readonly backToListButton = RecipeConstants.backToListButton
  readonly searchPlaceholder = RecipeConstants.searchPlaceholder
  readonly defaultSearchKey = RecipeConstants.defaultSearchKey
  readonly defaultFirstPageRequest = RecipeConstants.defaultFirstPageRequest

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
