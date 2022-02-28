import { gql, useMutation } from '@apollo/client'

import { strings as commonStrings } from '../../common/strings'
import { useError } from '../../components/ErrorProvider'
import { MarkerFragment } from '../fragments/marker'
import {
  AddMarkerInput,
  AddMarkerMutation as AddMarkerMutationData,
  AddMarkerMutationVariables,
} from '../types'

const AddMarkerMutation = gql`
  mutation AddMarkerMutation($input: AddMarkerInput!) {
    addMarker(input: $input) {
      ...Marker
    }
  }
  ${MarkerFragment}
`

export const useAddMarker = () => {
  const { displayError, displaySuccess } = useError()
  const [mutate] = useMutation<
    AddMarkerMutationData,
    AddMarkerMutationVariables
  >(AddMarkerMutation, {
    onCompleted: () =>
      displaySuccess([
        {
          description: strings.success,
          title: commonStrings.success,
        },
      ]),
    onError: () =>
      displayError([
        {
          description: strings.error,
          title: commonStrings.error,
        },
      ]),
    refetchQueries: ['MarkersQuery'],
  })

  return {
    addMarker: (input: AddMarkerInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }
}

const strings = {
  error: 'Error al ingresar el evento.',
  success: 'Evento ingresado con éxito.',
}
