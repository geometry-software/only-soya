import { PaginationRequest } from 'src/app/shared/model/pagination.model'
import { OrderRequest, RepositoryEntityStatus, SizeRequest } from 'src/app/shared/repository/repository.model'
import { CustomerStatus } from '../../vegi/utils/customer.model'

export interface Plate {
  timestamp?: Date
  name?: string
  description?: string
  price?: number
  nutritionalValue?: NutritionalValue
  types?: Array<PlateType>
  category?: string
  imgURL?: string
  id?: string
  status?: PlateStatus
}

export interface NutritionalValue {
  calories?: number
  fat?: number
  protein?: number
  carbohydrates?: number
}

export interface PlateRepositoryRequest {
  pagination: PaginationRequest<Plate>
  size: SizeRequest
  status: CustomerStatus
  order: OrderRequest
  plateType: PlateType
  plateCategory: PlateCategory
}

export type PlateStatus = RepositoryEntityStatus

export type PlateType = 'vegan' | 'gluten_free' | 'sugar_free' | 'all'

export type PlateCategory = 'all' | 'starter' | 'soup' | 'salad' | 'main' | 'drink' | 'dessert' | 'extra'

export enum PLATE_CATEGORY_TRANSLATE {
  all = 'MISC.PLATE_CATEGORY.ALL',
  starter = 'MISC.PLATE_CATEGORY.STARTER',
  soup = 'MISC.PLATE_CATEGORY.SOUP',
  salad = 'MISC.PLATE_CATEGORY.SALAD',
  main = 'MISC.PLATE_CATEGORY.MAIN',
  drink = 'MISC.PLATE_CATEGORY.DRINK',
  dessert = 'MISC.PLATE_CATEGORY.DESSERT',
  extra = 'MISC.PLATE_CATEGORY.EXTRA',
}

export enum PLATE_CATEGORY_TRANSLATE_FORM {
  starter = 'MISC.PLATE_CATEGORY.STARTER',
  soup = 'MISC.PLATE_CATEGORY.SOUP',
  salad = 'MISC.PLATE_CATEGORY.SALAD',
  main = 'MISC.PLATE_CATEGORY.MAIN',
  drink = 'MISC.PLATE_CATEGORY.DRINK',
  dessert = 'MISC.PLATE_CATEGORY.DESSERT',
  extra = 'MISC.PLATE_CATEGORY.EXTRA',
}

export enum PLATE_TYPE_TRANSLATE {
  vegan = 'MISC.PLATE_TYPE.VEGAN',
  gluten_free = 'MISC.PLATE_TYPE.GLUTEN_FREE',
  sugar_free = 'MISC.PLATE_TYPE.SUGAR_FREE',
}
