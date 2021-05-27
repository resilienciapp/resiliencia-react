import { gql } from '@apollo/client'

export const CategoryFragment = gql`
  fragment Category on Category {
    description
    id
    name
  }
`
