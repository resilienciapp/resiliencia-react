import React, { CSSProperties } from 'react'

import { Color } from '../../style'

interface Props {
  error?: boolean
  label: string
  style?: CSSProperties
}

export const Label: React.FunctionComponent<Props> = ({
  error = false,
  label,
  style,
}) => (
  <div style={style}>
    <label>
      <strong>{label}</strong>
    </label>
    <label style={styles.label}>{error ? ' *' : ''}</label>
  </div>
)

const styles: Record<string, React.CSSProperties> = {
  label: {
    color: Color.Reddish,
  },
}
