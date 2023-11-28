import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AuthRoutingModule } from './auth-routing.module'
import { LoginComponent } from './components/login/login.component'
import { ProfileComponent } from './components/profile/profile.component'
import { UserListComponent } from './components/user-list/user-list.component'
import { SharedModule } from '../shared/shared.module'
import { TranslateModule } from '@ngx-translate/core'
import { StoreModule } from '@ngrx/store'
import { reducer } from './store/auth.reducer'
import { EffectsModule } from '@ngrx/effects'
import { AuthEffects } from './store/auth.effects'
import { AuthConstants } from './utils/auth.constants'
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component'

@NgModule({
  declarations: [AuthLayoutComponent, LoginComponent, ProfileComponent, UserListComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    TranslateModule,
    StoreModule.forFeature(AuthConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class AuthModule {}
