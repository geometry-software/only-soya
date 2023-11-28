import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ButtonAction } from '../../model/form.model'

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonComponent {
  @Input()
  title: string
  @Input()
  icon: string
  @Input()
  url: string
  @Input()
  disabled: boolean
  @Input()
  type: ButtonAction
  @Input()
  buttonType: string = 'button'
  isMobile: boolean = window.screen.width > 760 ? false : true

  constructor() {
    // this.isMobile = false
  }
}
