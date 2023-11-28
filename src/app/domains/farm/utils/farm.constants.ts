import { PaginationRequest } from 'src/app/shared/model/pagination.model'
import { Recipe, RecipeStatus } from './farm.model'
import { RepositoryRequest, RepositoryRequestOrder, SizeRequest } from 'src/app/shared/repository/repository.model'
import { Sort } from '@angular/material/sort'

export abstract class RecipeConstants {
  static readonly storeFeatureKey = 'RECIPES'
  static readonly collectionName = 'Recipes'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'timestamp'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'recipes'
  static readonly paginationSize = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  static readonly moduleUrl = '/recipes'
  static readonly tableColumns = ['name', 'type', 'price']
  static readonly disableSort = true
  static readonly searchPlaceholder = 'RECIPES.PAGE.LIST.TABLE.SEARCH'
  static readonly deleteTitle = 'RECIPES.PAGE.DETAIL.DELETE_TITLE'
  static readonly backToListButton = 'RECIPES.NAVBAR'
  static readonly defaultPaginationControlValue: PaginationRequest<Recipe> = {
    query: 'first',
    item: null,
  }
  static readonly defaultSizeControlValue: SizeRequest = {
    size: 4,
  }
  static readonly defaultOrderControlValue: Sort = { active: 'timestamp', direction: 'desc' }
  static readonly defaultRequestStatus = 'active'
  static readonly defaultFirstPageRequest: RepositoryRequest<Recipe, RecipeStatus> = {
    pagination: this.defaultPaginationControlValue,
    order: {
      key: this.defaultOrderControlValue.active,
      value: this.defaultOrderControlValue.direction as RepositoryRequestOrder,
    },
    size: this.defaultSizeControlValue,
    status: this.defaultRequestStatus,
  }
}

export enum PLATE_TYPE_TRANSLATE {
  main = 'MISC.PLATE_TYPE.MAIN',
  entrance = 'MISC.PLATE_TYPE.ENTRANCE',
  drink = 'MISC.PLATE_TYPE.DRINK',
  salad = 'MISC.PLATE_TYPE.SALAD',
  rice = 'MISC.PLATE_TYPE.RICE',
  topping = 'MISC.PLATE_TYPE.TOPPING',
  dessert = 'MISC.PLATE_TYPE.DESSERT',
  extra = 'MISC.PLATE_TYPE.EXTRA',
}
