import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Customer, CustomerMenuTotalResponse, CustomerRepositoryRequest } from '../utils/customer.model'
import { FilterRequest, RepositoryEntityAction, RepositoryRequestQuery } from 'src/app/shared/repository/repository.model'
import { CustomerConstants } from '../utils/customer.constants'
import { PlateType } from '../../plate/utils/plate.model'

export const CustomeActions = createActionGroup({
  source: CustomerConstants.storeFeatureKey,
  events: {
    'Create Item Form Init': emptyProps(),
    'Create Item': props<{ item: Customer }>(),
    'Create Item Success': emptyProps(),
    'Update Item': props<{ item: Customer; id: string }>(),
    'Delete Item': props<{ id: string }>(),
    'Delete Item Success': emptyProps(),
    'Get Item': props<{ id: string }>(),
    'Get Item Success': props<{ item: Customer }>(),
    'Get Items': props<{ request: CustomerRepositoryRequest }>(),
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
