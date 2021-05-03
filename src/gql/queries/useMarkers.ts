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
  const { displayError, displayInformation, displaySuccess } = useError()
  const { data } = useQuery<Result>(MarkersQuery, {
    onCompleted: data =>
      data.markers.length
        ? displaySuccess([
            {
              description: strings.successDescription,
              title: strings.successTitle,
            },
          ])
        : displayInformation([
            {
              description: strings.informationDescription,
              title: strings.informationTitle,
            },
          ]),
    onError: () =>
      displayError([
        {
          description: strings.errorDescription,
          title: strings.successDescription,
        },
      ]),
  })

  return data
}

const strings = {
  errorDescription: 'No se pudo confirmar el marcador.',
  errorTitle: 'Error',
  informationDescription: 'No existen eventos cerca de su ubicación',
  informationTitle: 'Información',
  successDescription: 'El marcador fue confirmado con éxito.',
  successTitle: 'Éxito',
}
