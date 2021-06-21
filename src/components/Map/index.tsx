import { LatLngExpression } from 'leaflet'
import React, { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

import { useMarkers } from '../../gql/queries/useMarkers'
import { Marker as MarkerEntity } from '../../gql/types'
import { LocationMarker } from '../LocationMarker'
import { Marker } from './Marker'

export const Map: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerEntity[]>([])

  useMarkers(setMarkers)

  return (
    <MapContainer
      center={[-34.895376, -56.187666] as LatLngExpression}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100vh' }}
      zoomControl={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker saveMarkers={setMarkers} />
      {markers.map(marker => (
        <Marker key={marker.id} {...marker} />
      ))}
    </MapContainer>
  )
}
