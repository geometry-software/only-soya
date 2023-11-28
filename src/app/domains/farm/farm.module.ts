import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FarmRoutingModule } from './farm-routing.module'
import { TranslateModule } from '@ngx-translate/core'
import { SharedModule } from '../../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { RecipeConstants } from './utils/farm.constants'
import { reducer } from './store/farm.reducer'
import { RecipeEntityService } from './services/farm.service'
import { EffectsModule } from '@ngrx/effects'
import { RecipeEffects } from './store/farm.effects'

@NgModule({
  declarations: [RecipeFormComponent, RecipeListComponent, RecipeDetailComponent, RecipeLayoutComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FarmRoutingModule,
    TranslateModule,
    StoreModule.forFeature(RecipeConstants.storeFeatureKey, reducer),
    EffectsModule.forFeature([RecipeEffects]),
  ],
  providers: [RecipeEntityService],
})
export class FarmModule {}
