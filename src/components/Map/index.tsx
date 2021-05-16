import './Map.css'

import { LatLngExpression } from 'leaflet'
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

import { useMarkers } from '../../gql/queries/useMarkers'
import { LocationMarker } from '../LocationMarker'

export const Map: React.FC = () => {
  const data = useMarkers()

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
      <LocationMarker />
      {data?.markers.map(marker => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          title={marker.name}>
          <Popup>
            <div className="marker-popup-container">
              <span>{marker.name}</span>
              <div className=".marker-popup-container"></div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
