import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core'
import { MatSort, Sort } from '@angular/material/sort'
import { Observable, shareReplay, tap } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { PLATE_CATEGORY_TRANSLATE, PLATE_TYPE_TRANSLATE, Plate, PlateCategory, PlateType } from '../../utils/plate.model'
import { PlateConstants } from '../../utils/plate.constants'
import { PlateActions as ItemActions } from '../../store/plate.actions'
import { getItems, getItemsLoadingState, getListLabels, getPaginationResponse } from '../../store/plate.selectors'
import { FormControl } from '@angular/forms'
import { PaginationRequest, PaginationResponse } from 'src/app/shared/model/pagination.model'
import { SizeRequest } from 'src/app/shared/repository/repository.model'
import { SharedConstants } from 'src/app/shared/utils/shared.constants'
import { combineListControls } from '../../utils/combine-list-controls'
import { SignalService } from 'src/app/shared/services/signal.service'
import { MatTabChangeEvent } from '@angular/material/tabs'

@Component({
  selector: 'app-plate-list',
  templateUrl: './plate-list.component.html',
  styleUrls: ['./plate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlateListComponent implements OnInit {
  // Selectors
  readonly dataList$: Observable<Plate[]> = this.store$.select(getItems)
  readonly downloadState$: Observable<boolean> = this.store$.select(getItemsLoadingState).pipe(shareReplay(1))
  readonly paginationPayload$: Observable<PaginationResponse<Plate>> = this.store$.select(getPaginationResponse)
  readonly listLabels$ = this.store$.select(getListLabels).pipe(shareReplay(1))

  // Other properties
  readonly plateCategoryTranslate = PLATE_CATEGORY_TRANSLATE
  readonly plateTypeTranslate = PLATE_TYPE_TRANSLATE
  @ViewChild(MatSort, { static: false }) sort: MatSort

  // Constants
  readonly defaultPaginationControlValue = PlateConstants.defaultPaginationControlValue
  readonly defaultSizeControlValue = PlateConstants.defaultSizeControlValue
  readonly tableColumns = PlateConstants.tableColumns
  readonly moduleUrl = PlateConstants.moduleUrl
  readonly defaultOrderControlValue = PlateConstants.defaultOrderControlValue
  readonly tableLoadingOpacity = SharedConstants.tableLoadingOpacity
  readonly defaultRequestStatus = PlateConstants.defaultRequestStatus
  readonly defaultTableSort = PlateConstants.defaultTableSort
  readonly disableSort = PlateConstants.disableSort

  // Controls
  readonly paginationControl: FormControl<PaginationRequest<Plate>> = new FormControl(this.defaultPaginationControlValue)
  readonly sizeControl: FormControl<SizeRequest> = new FormControl(this.defaultSizeControlValue)
  readonly orderControl: FormControl<Sort> = new FormControl(this.defaultOrderControlValue)
  readonly plateTypeControl: FormControl<PlateType> = new FormControl('all')
  readonly plateCategoryControl: FormControl<PlateCategory> = new FormControl('all')

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

  redirectToDetail(id: string) {
    this.router.navigate([`/${this.moduleUrl}` + `/${id}`])
  }

  changePlateCategory(event: MatTabChangeEvent) {
    let labelAmount = event.tab.textLabel.split('(').pop().slice(0, -1)
    const category = event.tab.textLabel.slice(0, -labelAmount.length - 3).toLowerCase()
    this.plateCategoryControl.setValue(category as PlateCategory)
  }
}
