import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FarmListComponent } from './components/farm-list/farm-list.component'
import { FarmFormComponent } from './components/farm-form/farm-form.component'
import { FarmDetailComponent } from './components/farm-detail/farm-detail.component'
import { LandOwnerLayoutComponent } from './components/farm-layout/farm-layout.component'

const routes: Routes = [
  {
    path: '',
    component: LandOwnerLayoutComponent,
    children: [
      {
        path: 'stats',
        component: FarmFormComponent,
        data: { title: 'Payment Stats', type: 'list' },
      },
      {
        path: '',
        component: FarmListComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR', type: 'list' },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FarmRoutingModule {}
