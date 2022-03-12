/* eslint-disable sort-keys */
import { gql, useLazyQuery } from '@apollo/client'
import * as XLSX from 'xlsx'

import { strings as commonStrings } from '../../common/strings'
import { useError } from '../../components/ErrorProvider'
import {
  MarkersAnalytics,
  MarkersAnalytics_markersAnalytics as MarkerAnalytics,
} from '../types'

const downloadExcel = (data: MarkerAnalytics[]) => {
  const formattedData = data.map(element => ({
    Identificador: element.id,
    Categoría: element.category,
    Nombre: element.name,
    Descripción: element.description,
    Duración: element.duration,
    'Fecha de expiración': element.expiresAt,
    Latitud: element.latitude,
    Longitud: element.longitude,
    Administradores: element.owners,
    Recurrencia: element.recurrence,
    Solicitudes: element.requests,
    Subscriptores: element.subscriptions,
    'Zona horaria': element.timeZone,
  }))

  const worksheet = XLSX.utils.json_to_sheet(formattedData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Eventos')
  XLSX.writeFile(workbook, 'Eventos.xlsx')
}

const MarkersAnalyticsQuery = gql`
  query MarkersAnalytics {
    markersAnalytics {
      category
      description
      duration
      expiresAt
      id
      latitude
      longitude
      name
      owners
      recurrence
      requests
      subscriptions
      timeZone
    }
  }
`

export const useMarkersAnalytics = () => {
  const { displayError } = useError()

  const [getMarkersAnalyticsData] = useLazyQuery<MarkersAnalytics>(
    MarkersAnalyticsQuery,
    {
      fetchPolicy: 'network-only',
      onCompleted: ({ markersAnalytics }) => downloadExcel(markersAnalytics),
      onError: () =>
        displayError([
          { description: strings.error, title: commonStrings.error },
        ]),
    },
  )

  return { getMarkersAnalyticsData }
}

const strings = {
  error: 'Error al obtener la información del servidor.',
}
