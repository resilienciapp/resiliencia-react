import {
  ConfirmMarkerInput,
  Marker,
  MutationConfirmMarkerArgs,
} from '../../generated/graphql'
import { gql, useMutation } from '@apollo/client'
import { MarkerFragment } from '../fragments/marker'
import { useError } from '../../components/ErrorProvider'

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
  const { displayError, displaySuccess } = useError()
  const [mutate] = useMutation<Response, MutationConfirmMarkerArgs>(
    ConfirmMarkerMutation,
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

  const confirmMarker = (input: ConfirmMarkerInput) => async () => {
    await mutate({
      variables: {
        input,
      },
    })
  }

  return { confirmMarker }
}

const strings = {
  errorDescription: 'No se pudo confirmar el marcador.',
  errorTitle: 'Error',
  successDescription: 'El marcador fue confirmado con éxito.',
  successTitle: 'Éxito',
}
