import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { StoreModule } from '@ngrx/store'
import { TranslateModule } from '@ngx-translate/core'
import { PlateRoutingModule } from './plate-routing.module'
import { PlateListComponent } from './components/plate-list/plate-list.component'
import { PlateFormComponent } from './components/plate-form/plate-form.component'
import { PlateDetailComponent } from './components/plate-detail/plate-detail.component'
import { SharedModule } from '../../shared/shared.module'
import { PlateLayoutComponent } from './components/plate-layout/plate-layout.component'
import { PlateConstants } from './utils/plate.constants'
import { reducer } from './store/plate.reducer'
import { PlateEntityService } from './services/plate.service'
import { EffectsModule } from '@ngrx/effects'
import { PlateEffects } from './store/plate.effects'

@NgModule({
  declarations: [PlateFormComponent, PlateListComponent, PlateDetailComponent, PlateLayoutComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PlateRoutingModule,
    TranslateModule,
    StoreModule.forFeature(PlateConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([PlateEffects]),
  ],
  providers: [PlateEntityService],
})
export class PlateModule {}
