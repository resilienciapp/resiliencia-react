import './Body.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import { LocationMarker } from './LocationMarker'
import React from 'react'
import { useMarkers } from './gql/queries/useMarkers'

export const Body: React.FC = () => {
  const { data } = useMarkers()

  return (
    <div className="body-container">
      <MapContainer
        center={[-34.895376, -56.187666] as LatLngExpression}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '98vh' }}
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
              <span>{marker.name}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}