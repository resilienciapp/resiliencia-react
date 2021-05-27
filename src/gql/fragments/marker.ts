import { gql } from '@apollo/client'

import { CategoryFragment } from './category'

export const MarkerFragment = gql`
  fragment Marker on Marker {
    active
    category {
      ...Category
    }
    description
    expiresAt
    id
    latitude
    longitude
    name
    recurrence
  }
  ${CategoryFragment}
`
