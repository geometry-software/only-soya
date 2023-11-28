import { Component, ViewChild, OnInit, Signal, ChangeDetectorRef } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav'
import { userMenuOptions } from '../../utils/menu.options'
import { TranslateService } from '@ngx-translate/core'
import { SignalService } from 'src/app/shared/services/signal.service'
import { AuthStatus, AuthUser } from 'src/app/auth/utils/auth.model'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer
  mode: MatDrawerMode

  testUser: AuthUser = {
    name: 'Cafe user',
    status: 'admin',
    uid: 'admin_1',
  }

  hasNewDelivery: boolean
  dishesAmount: number = 8 * 20
  readonly toolBarTitleSignal: Signal<string> = this.signalService.getToolbarTitle
  readonly userMenuOptions = userMenuOptions

  hasFirebaseAuth: boolean
  isUserUpdated: boolean

  // Grid Configuration
  isDesktopSize: boolean
  routerOutletContainerBackgroundColor: string
  routerOutletContainerHeight: string
  matDrawerContentHeight: string
  routerOutletContainerMargin: string
  routerOutletBorderRadius: string
  matDrawerContentBackgroundColor: string
  matToolbarRowButtonMargin: string
  matToolbarBackgroundColor: string
  menuListContainerMargin: string

  constructor(
    private angularFireAuth: AngularFireAuth,
    private signalService: SignalService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initUserData()
    this.checkDelivery()
    this.checkClient()
    this.updateScreenSize()
    this.initTranslate()
  }

  initTranslate() {
    this.translate.addLangs(['es', 'pt', 'en'])
    this.translate.setDefaultLang('en')
    const lang = this.translate.getBrowserLang()
    this.translate.use(lang.match(/es|en/) ? lang : 'en')
  }

  changeUser(user: AuthStatus) {
    if (user === 'cafe') {
      this.testUser = {
        name: 'Cafe user',
        status: 'cafe',
        uid: '123',
      }
    } else if (user === 'customer') {
      this.testUser = {
        name: 'Customer user',
        status: 'customer',
        uid: '456',
      }
    } else {
      this.testUser = {
        name: 'Cafe user',
        status: 'admin',
        uid: 'admin_1',
      }
    }
    this.signalService.setUserData(this.testUser)
  }

  initUserData(): void {
    this.angularFireAuth.authState.subscribe((auth) => {
      console.log(auth)
      this.hasFirebaseAuth = true
      this.isUserUpdated = true
    })
  }

  checkDelivery(): void {
    // this.daoDeliveryService.checkDelivery().subscribe((value) => {
    //   if (value?.length) this.hasNewDelivery = true
    //   else this.hasNewDelivery = false
    // })
  }

  checkClient(): void {
    // this.daoClient.getNewClients().subscribe((value) => {
    //   if (value.length !== 0) this.hasNewClient = true
    //   else this.hasNewClient = false
    // })
  }

  toggleDrawer(): void {
    if (this.isDesktopSize == false) this.drawer.toggle()
  }

  onActivateRouter(): void {
    window.scroll(0, 0)
  }

  updateScreenSize(): void {
    const screenWidth = window.screen.width
    if (screenWidth > 760) {
      this.isDesktopSize = true
      this.routerOutletContainerBackgroundColor = '#f1f1f1'
      this.routerOutletContainerHeight = 'calc(100vh - 90px)'
      this.matDrawerContentHeight = 'calc(100vh - 64px)'
      this.matDrawerContentBackgroundColor = '#ddd'
      this.matToolbarBackgroundColor = '#ddd'
      this.matToolbarRowButtonMargin = '15px'
      this.mode = 'side'
      this.routerOutletContainerMargin = '0 20px'
      this.routerOutletBorderRadius = '50px'
      this.menuListContainerMargin = '0'
    } else {
      this.isDesktopSize = false
      this.routerOutletContainerBackgroundColor = '#f1f1f1'
      this.routerOutletContainerHeight = 'calc(100vh)'
      this.matDrawerContentHeight = 'calc(100vh - 60px)'
      this.matDrawerContentBackgroundColor = '#fafafa'
      this.matToolbarBackgroundColor = '#fafafa !important'
      this.matToolbarRowButtonMargin = '0px'
      this.mode = 'over'
      this.routerOutletContainerMargin = '0'
      this.routerOutletBorderRadius = '0'
      this.menuListContainerMargin = '10px'
    }
  }

  changeLanguage(lang) {
    this.translate.use(lang)
    this.cdr.markForCheck()
  }
}
