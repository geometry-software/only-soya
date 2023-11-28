import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CheckOutComponent } from './components/check-out/check-out.component'
import { CustomerMenuComponent } from './components/customer-menu/customer-menu.component'

const routes: Routes = [
  {
    path: 'menu',
    component: CustomerMenuComponent,
    data: { title: 'PLATES.PAGE.CREATE.TOOLBAR', type: 'form' },
  },
  {
    path: 'payments/api',
    component: CheckOutComponent,
    data: { title: 'PLATES.PAGE.EDIT.TOOLBAR', type: 'api' },
  },
  {
    path: 'payments',
    component: CheckOutComponent,
    data: { title: 'PLATES.PAGE.EDIT.TOOLBAR', type: 'form' },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class VegiRoutingModule {}
