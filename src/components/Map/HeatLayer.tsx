import 'leaflet.heat'

import * as Leaflet from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

import { Color } from '../../style'

interface Props {
  points: Leaflet.HeatLatLngTuple[]
  info: {
    checked: boolean
    gradient: {
      0.5: Color
      0.75: Color
      1: Color
    }
    radius: number
  }
}

export const HeatLayer: React.FunctionComponent<Props> = ({ info, points }) => {
  const map = useMap()

  useEffect(() => {
    if (info.checked && points.length) {
      const heatLayer = Leaflet.heatLayer(points, {
        gradient: info.gradient,
        maxZoom: 25,
        minOpacity: 0.5,
        radius: info.radius,
      }).addTo(map)

      map.addLayer(heatLayer)

      return () => {
        map.removeLayer(heatLayer)
      }
    }
  }, [
    map,
    points.length,
    info.radius,
    info.gradient['0.5'],
    info.gradient['0.75'],
    info.gradient['1'],
  ])

  return null
}
