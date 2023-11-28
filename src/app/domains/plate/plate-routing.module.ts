import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PlateListComponent } from './components/plate-list/plate-list.component'
import { PlateFormComponent } from './components/plate-form/plate-form.component'
import { PlateDetailComponent } from './components/plate-detail/plate-detail.component'
import { PlateLayoutComponent } from './components/plate-layout/plate-layout.component'

const routes: Routes = [
  {
    path: '',
    component: PlateLayoutComponent,
    children: [
      {
        path: '',
        component: PlateListComponent,
        data: { title: 'PLATES.PAGE.LIST.TOOLBAR', type: 'list' },
      },
      {
        path: 'create',
        component: PlateFormComponent,
        data: { title: 'PLATES.PAGE.CREATE.TOOLBAR', type: 'form' },
      },
      {
        path: ':id/edit',
        component: PlateFormComponent,
        data: { title: 'PLATES.PAGE.EDIT.TOOLBAR', type: 'form' },
      },
      {
        path: ':id',
        component: PlateDetailComponent,
        data: { title: 'PLATES.PAGE.DETAIL.TOOLBAR', type: 'detail' },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PlateRoutingModule {}
