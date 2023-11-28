import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from './plate.reducer'
import { PlateConstants } from '../utils/plate.constants'
import { CustomerConstantsCategoryLabel } from '../../vegi/utils/customer.constants'

const storeFeatureKey: string = PlateConstants.storeFeatureKey
const paginationTitle: string = PlateConstants.paginationTitle
const paginationSize: Array<number> = PlateConstants.paginationSize

const labelAll: string = CustomerConstantsCategoryLabel.all
const labelStarter: string = CustomerConstantsCategoryLabel.starter
const labelSoup: string = CustomerConstantsCategoryLabel.soup
const labelSalad: string = CustomerConstantsCategoryLabel.salad
const labelMain: string = CustomerConstantsCategoryLabel.main
const labelDrink: string = CustomerConstantsCategoryLabel.drink
const labelDessert: string = CustomerConstantsCategoryLabel.dessert
const labelExtra: string = CustomerConstantsCategoryLabel.extra

export const getState = createFeatureSelector<State>(storeFeatureKey)
export const getItems = createSelector(getState, (state) => state.items?.data)
export const getItemsPageAmount = createSelector(getState, (state) => state.items?.data?.length)
export const getResetRequestToTheFirstPage = createSelector(getState, (state) => state.resetRequest)
export const getItem = createSelector(getState, (state) => state.item?.data)
export const getItemId = createSelector(getState, (state) => state.itemId)
export const getPaginationItem = createSelector(getItems, (state) => ({
  first: state?.length ? [...state][0] : null,
  last: state?.length ? [...state].pop() : null,
}))
export const getItemLoadingState = createSelector(getState, (state) => state.item.loading)
export const getItemsLoadingState = createSelector(getState, (state) => state.items.loading)
export const getLayoutLoading = createSelector(getItemLoadingState, getItemsLoadingState, (item, items) => item || items)
export const getTotal = createSelector(getState, (state) => state.items.total)
export const getCurrent = createSelector(getState, (state) => state.items?.current)
export const getListResponseType = createSelector(getState, (state) => state.listResponseType)
export const getPaginationResponse = createSelector(getPaginationItem, getCurrent, getTotal, (item, current, total) => ({
  item: {
    first: item.first,
    last: item.last,
  },
  options: {
    current: current,
    total: total,
    title: paginationTitle,
    sizeList: paginationSize,
  },
}))
export const getPlateTypes = createSelector(getState, (state) => state.plateTypes)
export const getListLabelAmount = createSelector(getState, (state) => state.listLabelAmount)
export const getListLabels = createSelector(getListLabelAmount, (state) => ({
  all: labelAll + ' (' + state.all + ')',
  starter: labelStarter + ' (' + state.starter + ')',
  soup: labelSoup + ' (' + state.soup + ')',
  salad: labelSalad + ' (' + state.salad + ')',
  main: labelMain + ' (' + state.main + ')',
  drink: labelDrink + ' (' + state.drink + ')',
  dessert: labelDessert + ' (' + state.dessert + ')',
  extra: labelExtra + ' (' + state.extra + ')',
}))
