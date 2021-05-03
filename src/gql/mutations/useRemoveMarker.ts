import {
  Marker,
  MutationRemoveMarkerArgs,
  RemoveMarkerInput,
} from '../../generated/graphql'
import { gql, useMutation } from '@apollo/client'
import { MarkerFragment } from '../fragments/marker'

interface Response {
  removeMarker: Marker
}

const RemoveMarkerMutation = gql`
  mutation RemoveMarker($input: RemoveMarkerInput!) {
    removeMarker(input: $input) {
      ...Marker
    }
  }
  ${MarkerFragment}
`

export const useRemoveMarker = () => {
  const [mutate] = useMutation<Response, MutationRemoveMarkerArgs>(
    RemoveMarkerMutation,
  )

  const removeMarker = (input: RemoveMarkerInput) => async () => {
    await mutate({
      variables: {
        input,
      },
    })
  }

  return { removeMarker }
}
