import { CustomerRepositoryRequest } from './customer.model'

export const formatRequest = (request: CustomerRepositoryRequest, resetRequest: boolean) => ({
  size: request?.size.size,
  item: request?.pagination?.item,
  query: resetRequest ? 'first' : request?.pagination.query,
  order: request.order,
  status: request.status,
  plateCategory: request.plateCategory,
  plateType: request.plateType,
})
