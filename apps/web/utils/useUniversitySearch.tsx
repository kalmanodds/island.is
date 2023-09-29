import Fuse from 'fuse.js'

interface FilterProps {
  key: string
  value: Array<string>
}

interface SearchProductsProps {
  fuseInstance: Fuse<any>
  query?: string
  activeFilters: Array<FilterProps>
}
export const SearchProducts = ({
  fuseInstance,
  query,
  activeFilters,
}: SearchProductsProps) => {
  const queryMaker = { $or: [] }

  if (query) {
    queryMaker.$or.push(
      { nameIs: query },
      { departmentNameIs: query },
      { descriptionIs: query },
    )
  }

  activeFilters.map((filter) => {
    filter.value.map((searchParam) => {
      queryMaker.$or.push({ [filter.key]: searchParam })
    })
  })

  const result = fuseInstance.search(queryMaker)

  return result
}
