import { gql, useQuery } from '@apollo/client'
import { Marker } from '../../generated/graphql'
import { MarkerFragment } from '../fragments/marker'

const MarkersQuery = gql`
  query markers {
    markers {
      ...Marker
    }
  }
  ${MarkerFragment}
`

interface Result {
  markers: Marker[]
}

export const useMarkers = () => useQuery<Result>(MarkersQuery)
