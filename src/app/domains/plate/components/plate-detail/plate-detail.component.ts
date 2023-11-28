import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { getItem, getItemLoadingState } from '../../store/plate.selectors'
import { PlateActions as ItemActions } from '../../store/plate.actions'
import { SignalService } from 'src/app/shared/services/signal.service'
import { PLATE_CATEGORY_TRANSLATE, PLATE_TYPE_TRANSLATE, Plate } from '../../utils/plate.model'
import { Observable, filter, map } from 'rxjs'

@Component({
  selector: 'app-plate-detail',
  templateUrl: './plate-detail.component.html',
  styleUrls: ['./plate-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlateDetailComponent implements OnInit {
  itemId: string
  loadingState$: Observable<boolean> = this.store$.select(getItemLoadingState)
  item$: Observable<Plate> = this.store$.select(getItem).pipe(
    filter((value) => !!value),
    map((el) => ({
      ...el,
      types: el.types.filter((type) => type !== 'all'),
    }))
  )

  plateCategoryTranslate = PLATE_CATEGORY_TRANSLATE
  plateTypeTranslate = PLATE_TYPE_TRANSLATE

  constructor(private store$: Store, private route: ActivatedRoute, private signalService: SignalService) {}

  ngOnInit() {
    this.initServerData()
    this.setSignals()
  }

  initServerData() {
    this.itemId = this.route.snapshot.params['id']
    this.store$.dispatch(ItemActions.getItem({ id: this.itemId }))
  }

  setSignals() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }
}
