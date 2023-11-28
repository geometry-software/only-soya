import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ProfileComponent } from './components/profile/profile.component'
import { LoginComponent } from './components/login/login.component'
import { UserListComponent } from './components/user-list/user-list.component'
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component'

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
        data: { title: 'PLATES.PAGE.LIST.TOOLBAR', type: 'empty' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'PLATES.PAGE.LIST.TOOLBAR', type: 'empty' },
      },
      {
        path: 'users',
        component: UserListComponent,
        data: { title: 'PLATES.PAGE.LIST.TOOLBAR', type: 'list' },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AuthRoutingModule {}
