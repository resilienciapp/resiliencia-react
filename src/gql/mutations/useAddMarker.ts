import {
  AddMarkerInput,
  Marker,
  MutationAddMarkerArgs,
} from '../../generated/graphql'
import { gql, useMutation } from '@apollo/client'
import { MarkerFragment } from '../fragments/marker'

export interface Response {
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
  const [mutate] = useMutation<Response, MutationAddMarkerArgs>(
    AddMarkerMutation,
  )

  const addMarker = async (input: AddMarkerInput, callback?: VoidFunction) => {
    await mutate({
      variables: {
        input,
      },
    })

    callback?.()
  }

  return { addMarker }
}
