import './Body.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import React from 'react'
import { useMarkers } from './useMarkers'

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
        {data?.markers.map(marker => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}>
            <Popup>
              <span>{marker.name ?? marker.id}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
