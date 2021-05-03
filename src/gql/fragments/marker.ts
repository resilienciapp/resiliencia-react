import { gql } from '@apollo/client'

export const MarkerFragment = gql`
  fragment Marker on Marker {
    description
    id
    latitude
    longitude
    name
  }
`
