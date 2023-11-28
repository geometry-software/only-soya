import { PlateType } from '../../plate/utils/plate.model'

export const transformPlateTypes = (plateTypes: Array<PlateType>, plateType): Array<PlateType> => {
  let types: Array<PlateType> = plateTypes
  if (plateType === 'all') {
    types = ['all']
  } else {
    types = types.filter((el) => el !== 'all')
    if (!types.includes(plateType)) {
      types.push(plateType)
    } else {
      types = types.filter((el) => el !== plateType)
    }
    if (types.length === 0) {
      types = ['all']
    }
  }
  return types
}
