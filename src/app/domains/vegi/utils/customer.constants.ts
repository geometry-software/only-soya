import { PaginationRequest } from 'src/app/shared/model/pagination.model'
import { Customer, CustomerRepositoryRequest } from './customer.model'
import { RepositoryRequestOrder, SizeRequest } from 'src/app/shared/repository/repository.model'
import { Sort } from '@angular/material/sort'

export abstract class CustomerConstants {
  static readonly storeFeatureKey = 'CUSTOMERS'
  static readonly collectionName = 'Customers'
  static readonly defaultCreateStatus = 'active'
  static readonly defaultTableSort = 'timestamp'
  static readonly defaultSearchKey = 'name'
  static readonly paginationTitle = 'plates'
  static readonly paginationSize = [5, 10, 20]
  static readonly moduleUrl = '/menu'
  static readonly tableColumns = ['name', 'category', 'price']
  static readonly disableSort = true
  static readonly searchPlaceholder = 'PLATES.PAGE.LIST.TABLE.SEARCH'
  static readonly deleteTitle = 'PLATES.PAGE.DETAIL.DELETE_TITLE'
  static readonly notifyCreateSuccessMessage = 'PLATES.PAGE.CREATE.NOTIFY_SUCCESS'
  static readonly notifyEditSuccessMessage = 'PLATES.PAGE.EDIT.NOTIFY_SUCCESS'
  static readonly backToListButton = 'PLATES.NAVBAR'
  static readonly defaultPaginationControlValue: PaginationRequest<Customer> = {
    query: 'first',
    item: null,
  }
  static readonly defaultSizeControlValue: SizeRequest = {
    size: 10,
  }
  static readonly defaultOrderControlValue: Sort = { active: 'timestamp', direction: 'desc' }
  static readonly defaultRequestStatus = 'active'
  static readonly defaultFirstPageRequest: CustomerRepositoryRequest = {
    pagination: this.defaultPaginationControlValue,
    order: {
      key: this.defaultOrderControlValue.active,
      value: this.defaultOrderControlValue.direction as RepositoryRequestOrder,
    },
    size: this.defaultSizeControlValue,
    status: this.defaultRequestStatus,
    plateCategory: 'all',
    plateType: 'all',
  }

  static readonly veganImage = '/assets/images/vegan.png'
  static readonly glutenFreeImage = '/assets/images/gluten-free.png'
  static readonly sugarFreeImage = '/assets/images/sugar-free.png'
  static readonly cardDefaultImage = '/assets/images/card_default.png'
}

export abstract class CustomerConstantsCategoryLabel {
  static readonly all = 'All'
  static readonly starter = 'Starter'
  static readonly soup = 'Soup'
  static readonly salad = 'Salad'
  static readonly main = 'Main'
  static readonly drink = 'Drink'
  static readonly dessert = 'Dessert'
  static readonly extra = 'Extra'
}
