import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SignalService } from 'src/app/shared/services/signal.service'
import { Payment } from '../../utils/customer.model'

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckOutComponent implements OnInit {
  data: Payment
  layoutType: { type: 'form' | 'list' | 'empty' | 'detail' | 'api' }
  isPrinting: boolean

  ngOnInit(): void {
    this.setSignals()
  }

  constructor(private signalService: SignalService, private route: ActivatedRoute) {
    effect(() => (this.data = this.signalService.getCheckoutPayload()))
    effect(() => (this.layoutType = this.signalService.getLayoutType().type))
  }

  setSignals() {
    this.signalService.setToolbarTitle(this.route.snapshot.data['title'])
    this.signalService.setLayoutType(this.route.snapshot.data['type'])
  }

  print = () => (this.isPrinting = !this.isPrinting)
}
