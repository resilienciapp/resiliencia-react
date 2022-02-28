import React, { ChangeEventHandler, CSSProperties } from 'react'

import { Color } from '../../style'

interface Props {
  label: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  style?: CSSProperties
  value: number | string
}

export const TableElement: React.FunctionComponent<Props> = ({
  label,
  onChange,
  style,
  value,
}) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
    <label style={{ fontSize: 12 }}>{label}</label>
    <input
      onChange={onChange}
      style={{
        color: Color.Steel,
        display: 'flex',
        marginLeft: '1px',
        textAlign: 'center',
        width: '70px',
        ...style,
      }}
      value={value}
    />
  </div>
)
