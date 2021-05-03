import {
  ConfirmMarkerInput,
  Marker,
  MutationConfirmMarkerArgs,
} from '../../generated/graphql'
import { gql, useMutation } from '@apollo/client'
import { MarkerFragment } from '../fragments/marker'

interface Response {
  confirmMarker: Marker
}

const ConfirmMarkerMutation = gql`
  mutation ConfirmMarker($input: ConfirmMarkerInput!) {
    confirmMarker(input: $input) {
      ...Marker
    }
  }
  ${MarkerFragment}
`

export const useConfirmMarker = () => {
  const [mutate] = useMutation<Response, MutationConfirmMarkerArgs>(
    ConfirmMarkerMutation,
  )

  const confirmMarker = (input: ConfirmMarkerInput) => async () => {
    await mutate({
      variables: {
        input,
      },
    })
  }

  return { confirmMarker }
}
