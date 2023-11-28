import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Sort } from '@angular/material/sort'
import { Observable, shareReplay, tap } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { Customer, Payment } from '../../utils/customer.model'
import { CustomerConstants } from '../../utils/customer.constants'
import { CustomeActions as ItemActions } from '../../store/customer.actions'
import { getItems, getItemsLoadingState, getListLabels, getPaginationResponse } from '../../store/customer.selectors'
import { FormControl } from '@angular/forms'
import { PaginationRequest, PaginationResponse } from 'src/app/shared/model/pagination.model'
import { SizeRequest } from 'src/app/shared/repository/repository.model'
import { SharedConstants } from 'src/app/shared/utils/shared.constants'
import { combineListControls } from '../../utils/combine-list-controls'
import { SignalService } from 'src/app/shared/services/signal.service'
import { PLATE_CATEGORY_TRANSLATE, PLATE_TYPE_TRANSLATE, PlateCategory, PlateType } from 'src/app/domains/plate/utils/plate.model'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation } from 'angular-animations'

@Component({
  selector: 'app-customer-menu',
  templateUrl: './customer-menu.component.html',
  styleUrls: ['./customer-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInDownOnEnterAnimation(), fadeOutUpOnLeaveAnimation()],
})
export class CustomerMenuComponent implements OnInit {
  // Selectors
  readonly dataList$: Observable<Customer[]> = this.store$.select(getItems).pipe(shareReplay(1))
  readonly downloadState$: Observable<boolean> = this.store$.select(getItemsLoadingState).pipe(shareReplay(1))
  readonly listLabels$ = this.store$.select(getListLabels).pipe(shareReplay(1))

  veganImage = CustomerConstants.veganImage
  glutenFreeImage = CustomerConstants.glutenFreeImage
  sugarFreeImage = CustomerConstants.sugarFreeImage

  hasPlateTypeFilter: boolean

  // Other properties
  readonly plateCategoryTranslate = PLATE_CATEGORY_TRANSLATE
  readonly plateTypeTranslate = PLATE_TYPE_TRANSLATE

  // Constants
  readonly defaultPaginationControlValue = CustomerConstants.defaultPaginationControlValue
  readonly defaultSizeControlValue = CustomerConstants.defaultSizeControlValue
  readonly tableColumns = CustomerConstants.tableColumns
  readonly moduleUrl = CustomerConstants.moduleUrl
  readonly defaultOrderControlValue = CustomerConstants.defaultOrderControlValue
  readonly tableLoadingOpacity = SharedConstants.tableLoadingOpacity
  readonly defaultRequestStatus = CustomerConstants.defaultRequestStatus
  readonly defaultTableSort = CustomerConstants.defaultTableSort
  readonly disableSort = CustomerConstants.disableSort
  readonly searchPlaceholder = CustomerConstants.searchPlaceholder

  // Controls
  readonly paginationControl: FormControl<PaginationRequest<Customer>> = new FormControl(this.defaultPaginationControlValue)
  readonly sizeControl: FormControl<SizeRequest> = new FormControl(this.defaultSizeControlValue)
  readonly orderControl: FormControl<Sort> = new FormControl(this.defaultOrderControlValue)
  readonly plateTypeControl: FormControl<PlateType> = new FormControl('all')
  readonly plateCategoryControl: FormControl<PlateCategory> = new FormControl('all')
  readonly searchControl: FormControl<string> = new FormControl()

  constructor(
    private store$: Store,
    private route: ActivatedRoute,
    private router: Router,
    private signalService: SignalService
  ) {}

  ngOnInit() {
    this.initData()
    this.setSignals()
  }

  initData() {
    combineListControls(this.paginationControl, this.orderControl, this.plateTypeControl, this.plateCategoryControl, this.store$)
      .pipe(
        tap(([pagination, order, plateType, plateCategory]) => {
          this.store$.dispatch(
            ItemActions.getItems({
              request: {
                status: this.defaultRequestStatus,
                pagination,
                size: {
                  size: 10,
                },
                order,
                plateType,
                plateCategory,
              },
            })
          )
        })
      )
      .subscribe()
  }

  setSignals() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }

  changePlateCategory(event: MatTabChangeEvent) {
    let labelAmount = event.tab.textLabel.split('(').pop().slice(0, -1)
    const category = event.tab.textLabel.slice(0, -labelAmount.length - 3).toLowerCase()
    this.plateCategoryControl.setValue(category as PlateCategory)
  }

  changePlateType(type: string) {
    this.plateTypeControl.setValue(type as PlateType)
  }

  showPlateTypeFilter() {
    this.hasPlateTypeFilter = !this.hasPlateTypeFilter
  }

  add(event) {
    const order: Payment = {
      plates: event,
      timestamp: new Date(),
      cafeNames: 'Hello Cafe',
      cafeIds: '123, ',
      customerNames: 'Hello Cafe',
      customerIds: '123, ',
      totalAmount: '4.30',
      totalChange: 'R$',
    }
    this.signalService.setCheckoutPayload(order)
    this.router.navigateByUrl('/vegi/payments')
  }
}
