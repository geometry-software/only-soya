import { PlateRepositoryRequest } from './plate.model'

export const formatRequest = (request: PlateRepositoryRequest, resetRequest: boolean) => ({
  size: request?.size.size,
  item: request?.pagination?.item,
  query: resetRequest ? 'first' : request?.pagination.query,
  order: request.order,
  status: request.status,
  plateCategory: request.plateCategory,
  plateType: request.plateType,
})
