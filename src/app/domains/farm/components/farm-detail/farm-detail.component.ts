import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table'
import { Store } from '@ngrx/store'
import { PLATE_TYPE_TRANSLATE } from '../../utils/farm.constants'
import { getItem, getItemLoadingState } from '../../store/farm.selectors'
import { RecipeActions as ItemActions } from '../../store/farm.actions'
import { SignalService } from 'src/app/shared/services/signal.service'
import { Recipe } from '../../utils/farm.model'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-farm-detail',
  templateUrl: './farm-detail.component.html',
  styleUrls: ['./farm-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailComponent implements OnInit {
  itemId: string
  loadingState$: Observable<boolean> = this.store$.select(getItemLoadingState)
  item$: Observable<Recipe> = this.store$.select(getItem)
  datasource = new MatTableDataSource()
  displayedColumns = ['timestamp']

  plateTypeTranslate = PLATE_TYPE_TRANSLATE

  constructor(private store$: Store, private route: ActivatedRoute, private signalService: SignalService) {}

  ngOnInit() {
    this.initServerData()
    this.setSignals()
  }

  initServerData() {
    this.itemId = this.route.snapshot.params['id']
    this.store$.dispatch(ItemActions.getItem({ id: this.itemId }))
    // this.daoHistory.getHistoryById(this.itemId).subscribe((res) => {
    //   this.datasource = new MatTableDataSource(res)
    //   this.isLoading = false
    // })
  }

  setSignals() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }
}
