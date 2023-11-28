import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Recipe, RecipeStatus } from '../utils/farm.model'
import {
  FilterRequest,
  RepositoryEntityAction,
  RepositoryRequest,
  RepositoryRequestQuery,
  RepositoryResponseEntity,
} from 'src/app/shared/repository/repository.model'
import { FormConstants } from '../utils/farm.constants'

export const RecipeActions = createActionGroup({
  source: FormConstants.storeFeatureKey,
  events: {
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: Recipe }>(),
    'Create Item Success': props<{ response: RepositoryResponseEntity; total: number }>(),
    'Update Item': props<{ item: Recipe; id: string }>(),
    'Update Item Success': emptyProps(),
    'Delete Item': props<{ id: string }>(),
    'Delete Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Recipe }>(),
    'Get Items': props<{ request: RepositoryRequest<Recipe, RecipeStatus> }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{ items: Recipe[]; query: RepositoryRequestQuery; total?: number; size?: number }>(),
    'Notify Error': props<{ error: Error; errorType: RepositoryEntityAction }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
