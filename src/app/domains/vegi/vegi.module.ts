import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { StoreModule } from '@ngrx/store'
import { TranslateModule } from '@ngx-translate/core'
import { VegiRoutingModule } from './vegi-routing.module'
import { SharedModule } from '../../shared/shared.module'
import { CustomerConstants } from './utils/customer.constants'
import { reducer } from './store/customer.reducer'
import { CustomerEntityService } from './services/customer.service'
import { EffectsModule } from '@ngrx/effects'
import { CustomerEffects } from './store/customer.effects'
import { CustomerMenuComponent } from './components/customer-menu/customer-menu.component'
import { CheckOutComponent } from './components/check-out/check-out.component'
import { PlateEntityService } from '../plate/services/plate.service'
import { ToastFilterByTypesComponent } from './components/toast-filter-by-types/toast-filter-by-types.component'

@NgModule({
  declarations: [CustomerMenuComponent, CheckOutComponent, ToastFilterByTypesComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    VegiRoutingModule,
    TranslateModule,
    StoreModule.forFeature(CustomerConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([CustomerEffects]),
  ],
  providers: [CustomerEntityService, PlateEntityService],
})
export class VegiModule {}
