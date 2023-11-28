import { Injectable, computed, signal } from '@angular/core'
import { Payment } from 'src/app/domains/vegi/utils/customer.model'

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  private userData = signal(null)
  setUserData = (data): void => this.userData.set(data)
  getUserData = computed(() => this.userData())

  private toolbarTitle = signal(null)
  setToolbarTitle = (data) => setTimeout(() => this.toolbarTitle.set(data))
  getToolbarTitle = computed(() => this.toolbarTitle())

  private layoutType = signal(null)
  setLayoutType = (data) => this.layoutType.set(data)
  getLayoutType = computed(() => this.layoutType())

  checkoutPayloadSignal = signal<Payment>(null)
  setCheckoutPayload = (data) => this.checkoutPayloadSignal.set(data)
  getCheckoutPayload = computed(() => this.checkoutPayloadSignal())
}
