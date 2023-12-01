import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NavbarComponent } from './components/navbar/navbar.component'
import { IndexComponent } from './components/index/index.component'

export const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: '', component: IndexComponent },
      {
        path: 'login',
        loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'cafe',
        loadChildren: () => import('../domains/plate/plate.module').then((m) => m.PlateModule),
        canActivate: [],
      },
      {
        path: 'vegi',
        loadChildren: () => import('../domains/vegi/vegi.module').then((m) => m.VegiModule),
        canActivate: [],
      },
      {
        path: 'farm',
        loadChildren: () => import('../domains/farm/farm.module').then((m) => m.FarmModule),
        canActivate: [],
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
