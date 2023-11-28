import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FarmRoutingModule } from './farm-routing.module'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '../../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { FormConstants } from './utils/farm.constants'
import { reducer } from './store/farm.reducer'
import { FarmEntityService } from './services/farm.service'
import { EffectsModule } from '@ngrx/effects'
import { RecipeEffects } from './store/farm.effects'
import { FarmFormComponent } from './components/farm-form/farm-form.component'
import { LandOwnerLayoutComponent } from './components/farm-layout/farm-layout.component'
import { FarmListComponent } from './components/farm-list/farm-list.component'
import { FarmDetailComponent } from './components/farm-detail/farm-detail.component'

@NgModule({
  declarations: [LandOwnerLayoutComponent, FarmFormComponent, FarmDetailComponent, FarmListComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FarmRoutingModule,
    TranslateModule,
    StoreModule.forFeature(FormConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([RecipeEffects]),
  ],
  providers: [FarmEntityService],
})
export class FarmModule {}
