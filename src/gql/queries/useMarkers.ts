import { gql, useQuery } from '@apollo/client'
import { Marker } from '../../generated/graphql'
import { MarkerFragment } from '../fragments/marker'
import { useError } from '../../components/ErrorProvider'

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

export const useMarkers = () => {
  const { displayError } = useError()
  const { error, data } = useQuery<Result>(MarkersQuery)

  if (error) {
    displayError([{ title: error.message }])
  }

  return data
}
