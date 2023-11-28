import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { Plate } from 'src/app/domains/plate/utils/plate.model'
import { CustomerConstants } from 'src/app/domains/vegi/utils/customer.constants'

@Component({
  selector: 'app-card',
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCardComponent {
  cardDefaultImage = CustomerConstants.cardDefaultImage
  veganImage = CustomerConstants.veganImage
  glutenFreeImage = CustomerConstants.glutenFreeImage
  sugarFreeImage = CustomerConstants.sugarFreeImage

  @Input()
  data: Array<Plate>

  @Output()
  add = new EventEmitter()
}
