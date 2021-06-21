import { gql } from '@apollo/client'

import { CategoryFragment } from './category'

export const MarkerFragment = gql`
  fragment Marker on Marker {
    category {
      ...Category
    }
    description
    duration
    expiresAt
    id
    latitude
    longitude
    name
    recurrence
  }
  ${CategoryFragment}
`
