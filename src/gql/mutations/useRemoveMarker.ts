import {
  Marker,
  MutationRemoveMarkerArgs,
  RemoveMarkerInput,
} from '../../generated/graphql'
import { gql, useMutation } from '@apollo/client'
import { MarkerFragment } from '../fragments/marker'
import { useError } from '../../components/ErrorProvider'

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
  const { displayError, displaySuccess } = useError()
  const [mutate] = useMutation<Response, MutationRemoveMarkerArgs>(
    RemoveMarkerMutation,
    {
      onCompleted: () => displaySuccess([{ title: 'Éxito' }]),
      onError: error => displayError([{ title: error.message }]),
    },
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
