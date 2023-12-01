import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { fadeInOnEnterAnimation } from 'angular-animations'
import * as moment from 'moment'
import { SignalService } from 'src/app/shared/services/signal.service'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOnEnterAnimation()],
})
export class IndexComponent implements OnInit {
  today = moment(new Date()).locale('es').format('DD MMMM')

  chefName = 'Mike'
  chefIntro = 'Varios platos de la carta o su orden'

  constructor(private router: Router, private signalService: SignalService) {}

  ngOnInit() {}
}
