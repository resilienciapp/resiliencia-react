import { gql, useQuery } from '@apollo/client'

import { strings as commonStrings } from '../../common/strings'
import { useError } from '../../components/ErrorProvider'
import { CategoriesQuery as CategoriesQueryData } from '../../gql/types'
import { CategoryFragment } from '../fragments/category'

const CategoriesQuery = gql`
  query CategoriesQuery {
    categories {
      ...Category
    }
  }
  ${CategoryFragment}
`

export const useCategories = () => {
  const { displayError } = useError()
  const { data } = useQuery<CategoriesQueryData>(CategoriesQuery, {
    onError: () =>
      displayError([
        {
          description: strings.error,
          title: commonStrings.error,
        },
      ]),
  })

  return data
}

const strings = {
  error: 'Error al obtener las categorías.',
}
