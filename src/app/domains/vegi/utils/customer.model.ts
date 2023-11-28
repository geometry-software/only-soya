import { PaginationRequest } from 'src/app/shared/model/pagination.model'
import { OrderRequest, RepositoryEntityStatus, SizeRequest } from 'src/app/shared/repository/repository.model'
import { Plate, PlateCategory, PlateType } from '../../plate/utils/plate.model'

export interface Customer {
  timestamp?: Date
  name?: string
  description?: string
  price?: number
  type?: {
    vegan: boolean
    gluten_free: boolean
    sugar_free: boolean
  }
  category?: string
  imgURL?: string
  id?: string
  status?: CustomerStatus
}

export interface NutritionalValue {
  calories?: number
  fat?: number
  protein?: number
  carbohydrates?: number
}

export interface CustomerRepositoryRequest {
  pagination: PaginationRequest<Customer>
  size: SizeRequest
  status: CustomerStatus
  order: OrderRequest
  plateType: PlateType
  plateCategory: PlateCategory
}

export type CustomerStatus = RepositoryEntityStatus

export interface CustomerMenuTotalResponse {
  all: number
  starter: number
  soup: number
  salad: number
  main: number
  drink: number
  dessert: number
  extra: number
}

export interface CustomerPlateType {
  type: PlateType
  starter: number
  soup: number
  salad: number
  main: number
  drink: number
  dessert: number
  extra: number
}

export interface Payment {
  plates: Array<Plate>
  timestamp: any
  cafeNames: string
  cafeIds: string
  customerNames: string
  customerIds: string
  totalAmount: string
  totalChange: string
}
