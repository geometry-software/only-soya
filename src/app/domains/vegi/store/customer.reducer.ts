import { createReducer, on } from '@ngrx/store'
import { Customer, CustomerMenuTotalResponse } from '../utils/customer.model'
import { CustomeActions as ItemActions } from './customer.actions'
import { RepositoryRequesEntity, RepositoryResponseList } from 'src/app/shared/repository/repository.model'
import { PlateType } from '../../plate/utils/plate.model'

export interface State {
  item: RepositoryRequesEntity<Customer>
  itemId: string
  items: RepositoryResponseList<Customer>
  listResponseType: any
  resetRequest: boolean
  listLabelAmount: CustomerMenuTotalResponse
  plateTypes: Array<PlateType>
}

const initialState: State = {
  item: {
    loading: false,
  },
  itemId: null,
  items: {
    data: null,
    loading: false,
    total: null,
    current: null,
    size: null,
    error: null,
  },
  listResponseType: null,
  resetRequest: null,
  listLabelAmount: {
    all: 0,
    starter: 0,
    soup: 0,
    salad: 0,
    main: 0,
    drink: 0,
    dessert: 0,
    extra: 0,
  },
  plateTypes: [],
}

export const reducer = createReducer<State>(
  initialState,
  on(ItemActions.getItems, (state) => ({
    ...state,
    items: {
      data: state.items?.data,
      total: state.items?.total,
      current: state.items?.current,
      size: state.items?.size,
      loading: true,
      error: null,
    },
  })),
  on(ItemActions.getItemsBySearchQuery, (state) => ({
    ...state,
    items: {
      data: state.items?.data,
      total: state.items?.total,
      current: state.items?.data?.length,
      size: state.items?.size,
      loading: true,
      error: null,
    },
  })),
  on(ItemActions.getItemsSuccess, (state, { items, query, listLabelAmount, plateTypes }) => {
    return {
      ...state,
      listResponseType: query,
      listLabelAmount,
      plateTypes,
      items: {
        data: items,
        total: state.items.total,
        current: state.items.current,
        size: state.items.size,
        loading: false,
        error: null,
      },
      resetRequest: false,
      itemId: null,
    }
  }),
  on(ItemActions.getItem, (state, { id }) => ({
    ...state,
    itemId: id,
    item: {
      data: null,
      loading: true,
    },
  })),
  on(ItemActions.getItemSuccess, (state, { item }) => ({
    ...state,
    item: {
      data: item,
      loading: false,
    },
  })),
  on(ItemActions.createItemFormInit, (state) => ({
    ...state,
    item: {
      data: {},
      loading: false,
    },
  })),
  on(ItemActions.createItem, (state) => ({
    ...state,
    item: {
      // data: state.item?.data,
      loading: true,
    },
  })),
  on(ItemActions.updateItem, (state) => ({
    ...state,
    item: {
      data: state.item?.data,
      loading: true,
    },
  })),
  on(ItemActions.resetRequestToTheFirstPage, (state) => ({
    ...state,
    resetRequest: true,
  }))
)
