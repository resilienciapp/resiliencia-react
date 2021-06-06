import { gql, useQuery } from '@apollo/client'

import { strings as commonStrings } from '../../common/strings'
import { useError } from '../../components/ErrorProvider'
import { MarkerFragment } from '../fragments/marker'
import { MarkersQuery as MarkersQueryData } from '../types'

const MarkersQuery = gql`
  query MarkersQuery {
    markers {
      ...Marker
    }
  }
  ${MarkerFragment}
`

export const useMarkers = (setMarkers: CallableFunction) => {
  const { displayError, displayInformation, displaySuccess } = useError()
  const { data } = useQuery<MarkersQueryData>(MarkersQuery, {
    onCompleted: data => {
      if (data.markers.length) {
        setMarkers(data.markers)
        displaySuccess([
          {
            description: strings.success,
            title: commonStrings.success,
          },
        ])
      } else {
        displayInformation([
          {
            description: strings.information,
            title: commonStrings.information,
          },
        ])
      }
    },
    onError: () =>
      displayError([
        {
          description: strings.error,
          title: commonStrings.error,
        },
      ]),
  })

  return data
}

const strings = {
  error: 'Error al obtener los eventos.',
  information: 'No existen eventos cerca de su ubicación.',
  success: 'Eventos descargados con éxito.',
}
