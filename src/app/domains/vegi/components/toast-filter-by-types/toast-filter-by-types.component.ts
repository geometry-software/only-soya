import { Component } from '@angular/core'
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { getItemsLoadingState } from '../../store/customer.selectors'
import { CustomerConstants } from '../../utils/customer.constants'
import { PLATE_TYPE_TRANSLATE } from 'src/app/domains/plate/utils/plate.model'
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations'

@Component({
  selector: 'toast-filter-by-types',
  styleUrls: ['./toast-filter-by-types.component.scss'],
  templateUrl: 'toast-filter-by-types.component.html',
  animations: [fadeInOnEnterAnimation(), fadeOutOnLeaveAnimation()],
})
export class ToastFilterByTypesComponent {
  readonly downloadState$: Observable<boolean> = this.store$.select(getItemsLoadingState)
  readonly veganImage = CustomerConstants.veganImage
  readonly glutenFreeImage = CustomerConstants.glutenFreeImage
  readonly sugarFreeImage = CustomerConstants.sugarFreeImage
  readonly plateTypeTranslate = PLATE_TYPE_TRANSLATE

  constructor(private store$: Store, private matBottomSheetRef: MatBottomSheetRef<any>) {}

  close(event: MouseEvent): void {
    this.matBottomSheetRef.dismiss()
    event.preventDefault()
  }

  change(event: any) {
    this.matBottomSheetRef.dismiss(event.target)
  }
}
