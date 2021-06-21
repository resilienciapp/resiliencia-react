import React from 'react'

import { Color } from '../../style'

interface Props {
  error?: boolean
  label: string
}

export const Label: React.FunctionComponent<Props> = ({
  error = false,
  label,
}) => (
  <div>
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
