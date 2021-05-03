import { gql, useQuery } from '@apollo/client'
import { Marker } from '../../generated/graphql'
import { MarkerFragment } from '../fragments/marker'

interface Result {
  markers: Marker[]
}

const MarkersQuery = gql`
  query markers {
    markers {
      ...Marker
    }
  }
  ${MarkerFragment}
`

export const useMarkers = () => useQuery<Result>(MarkersQuery)
