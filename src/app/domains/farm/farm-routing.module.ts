import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RecipeListComponent } from './components/farm-list/farm-list.component'
import { RecipeFormComponent } from './components/farm-form/farm-form.component'
import { RecipeDetailComponent } from './components/farm-detail/farm-detail.component'
import { RecipeLayoutComponent } from './components/farm-layout/farm-layout.component'

const routes: Routes = [
  {
    path: '',
    component: RecipeLayoutComponent,
    children: [
      {
        path: '',
        component: RecipeListComponent,
        data: { title: 'RECIPES.PAGE.LIST.TOOLBAR', type: 'list' },
      },
      {
        path: 'create',
        component: RecipeFormComponent,
        data: { title: 'RECIPES.PAGE.CREATE.TOOLBAR', type: 'form' },
      },
      {
        path: ':id/edit',
        component: RecipeFormComponent,
        data: { title: 'RECIPES.PAGE.EDIT.TOOLBAR', type: 'form' },
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
        data: { title: 'RECIPES.PAGE.DETAIL.TOOLBAR', type: 'detail' },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FarmRoutingModule {}
