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
      onCompleted: () =>
        displaySuccess([
          {
            description: strings.successDescription,
            title: strings.successTitle,
          },
        ]),
      onError: () =>
        displayError([
          {
            description: strings.errorDescription,
            title: strings.successDescription,
          },
        ]),
      refetchQueries: ['markers'],
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

const strings = {
  errorDescription: 'No se pudo remover el marcador.',
  errorTitle: 'Error',
  successDescription: 'El marcador fue ingresado para ser removido.',
  successTitle: 'Éxito',
}
