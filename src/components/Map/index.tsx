import './Map.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import { LocationMarker } from '../LocationMarker'
import React from 'react'
import { useConfirmMarker } from '../../gql/mutations/useConfirmMarker'
import { useMarkers } from '../../gql/queries/useMarkers'
import { useRemoveMarker } from '../../gql/mutations/useRemoveMarker'

export const Map: React.FC = () => {
  const data = useMarkers()

  const { confirmMarker } = useConfirmMarker()
  const { removeMarker } = useRemoveMarker()

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
              <div className=".marker-popup-container">
                <button
                  onClick={confirmMarker({ id: marker.id })}
                  type="submit">
                  {strings.confirmEvent}
                </button>
                <button onClick={removeMarker({ id: marker.id })} type="submit">
                  {strings.removeEvent}
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

const strings = {
  confirmEvent: 'Confirmar Evento',
  removeEvent: 'Remover Evento',
}
