import React from 'react'
import { Marker as LeafletMarker, Popup } from 'react-leaflet'

import { strings as commonStrings } from '../../common/strings'
import { Marker as MarkerEntity } from '../../gql/types'

export const Marker: React.FunctionComponent<MarkerEntity> = ({
  category,
  latitude,
  longitude,
  name,
}) => (
  <LeafletMarker position={[latitude, longitude]} title={name}>
    <Popup>
      <div style={styles.container}>
        <div style={styles.containerSection}>
          <label style={styles.label}>{`${commonStrings.name}:`}</label>
          <p style={styles.text}>{name}</p>
        </div>
        <div style={styles.containerSection}>
          <label style={styles.label}>{`${commonStrings.category}:`}</label>
          <p style={styles.text}>{category.name}</p>
        </div>
      </div>
    </Popup>
  </LeafletMarker>
)

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  containerSection: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10%',
  },
  label: {
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 0,
    marginTop: '5%',
  },
}
