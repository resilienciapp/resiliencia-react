import { gql, useQuery } from '@apollo/client'
import { Marker } from './generated/graphql'

const MarkersQuery = gql`
  query markers {
    markers {
      description
      id
      latitude
      longitude
      name
    }
  }
`

interface Result {
  markers: Marker[]
}

export const useMarkers = () => useQuery<Result>(MarkersQuery)
