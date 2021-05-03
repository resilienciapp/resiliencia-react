import {
  AddMarkerInput,
  Marker,
  MutationAddMarkerArgs,
} from '../../generated/graphql'
import { gql, useMutation } from '@apollo/client'
import { MarkerFragment } from '../fragments/marker'
import { useError } from '../../components/ErrorProvider'

interface Response {
  addMarker: Marker
}

const AddMarkerMutation = gql`
  mutation AddMarker($input: AddMarkerInput!) {
    addMarker(input: $input) {
      ...Marker
    }
  }
  ${MarkerFragment}
`

export const useAddMarker = () => {
  const { displayError, displaySuccess } = useError()
  const [mutate] = useMutation<Response, MutationAddMarkerArgs>(
    AddMarkerMutation,
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

  const addMarker = async (input: AddMarkerInput) => {
    await mutate({
      variables: {
        input,
      },
    })
  }

  return { addMarker }
}

const strings = {
  errorDescription: 'No se pudo agregar el marcador.',
  errorTitle: 'Error',
  successDescription: 'El marcador fue agregado con éxito.',
  successTitle: 'Éxito',
}
