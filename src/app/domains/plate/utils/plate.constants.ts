import { PaginationRequest } from 'src/app/shared/model/pagination.model'
import { Plate, PlateRepositoryRequest, PlateStatus } from './plate.model'
import { RepositoryRequest, RepositoryRequestOrder, SizeRequest } from 'src/app/shared/repository/repository.model'
import { Sort } from '@angular/material/sort'

export abstract class PlateConstants {
  static readonly storeFeatureKey = 'PLATES'
  static readonly collectionName = 'Plates'
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
  static readonly defaultPaginationControlValue: PaginationRequest<Plate> = {
    query: 'first',
    item: null,
  }
  static readonly defaultSizeControlValue: SizeRequest = {
    size: 10,
  }
  static readonly defaultOrderControlValue: Sort = { active: 'timestamp', direction: 'desc' }
  static readonly defaultRequestStatus = 'active'
  static readonly defaultFirstPageRequest: PlateRepositoryRequest = {
    pagination: this.defaultPaginationControlValue,
    order: {
      key: this.defaultOrderControlValue.active,
      value: this.defaultOrderControlValue.direction as RepositoryRequestOrder,
    },
    size: this.defaultSizeControlValue,
    status: this.defaultRequestStatus,
    plateType: 'all',
    plateCategory: 'all',
  }
}
