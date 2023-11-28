import { createReducer, on } from '@ngrx/store'
import { Recipe } from '../utils/farm.model'
import { RecipeActions as ItemActions } from './farm.actions'
import { RepositoryRequesEntity, RepositoryResponseList } from 'src/app/shared/repository/repository.model'
import { formatPaginationData } from 'src/app/shared/repository/repository.utils'

export interface State {
  item: RepositoryRequesEntity<Recipe>
  itemId: string
  items: RepositoryResponseList<Recipe>
  listResponseType: any
  resetRequest: boolean
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
  on(ItemActions.getItemsSuccess, (state, { items, total, query, size }) => {
    const { responseTotal, current } = formatPaginationData(query, state, items.length, total, size ?? state.items?.size)
    return {
      ...state,
      listResponseType: query,
      items: {
        data: items,
        total: responseTotal,
        current: current,
        size: size ?? state.items.size,
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
      data: state.item?.data,
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
