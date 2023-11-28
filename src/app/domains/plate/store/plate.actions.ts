import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Plate, PlateRepositoryRequest, PlateType } from '../utils/plate.model'
import { FilterRequest, RepositoryEntityAction, RepositoryRequestQuery } from 'src/app/shared/repository/repository.model'
import { PlateConstants } from '../utils/plate.constants'
import { Customer, CustomerMenuTotalResponse } from '../../vegi/utils/customer.model'

export const PlateActions = createActionGroup({
  source: PlateConstants.storeFeatureKey,
  events: {
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: Plate }>(),
    'Create Item Success': emptyProps(),
    'Update Item': props<{ item: Plate; id: string }>(),
    'Delete Item': props<{ id: string }>(),
    'Delete Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Plate }>(),
    'Get Items': props<{ request: PlateRepositoryRequest }>(),
    'Get Items By Search Query': props<{ request: FilterRequest }>(),
    'Get Items Success': props<{
      items: Customer[]
      query: RepositoryRequestQuery
      plateTypes?: Array<PlateType>
      listLabelAmount?: CustomerMenuTotalResponse
    }>(),
    'Notify Error': props<{ error: Error; errorType: RepositoryEntityAction }>(),
    'Reset Request To The First Page': emptyProps(),
    'Reset State': emptyProps(),
  },
})
