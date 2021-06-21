import './Checkbox.css'

import React from 'react'

import { Color } from '../../style'

interface Props {
  error?: boolean
  label?: string
  name: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

export const Checkbox: React.FunctionComponent<Props> = ({
  error = false,
  label,
  name,
  onChange,
  value,
}) => (
  <label style={styles.container}>
    <input
      name={name}
      onChange={onChange}
      type="checkbox"
      value={value}
      required={error}
    />
    <span />
    {label}
  </label>
)

const styles: Record<string, React.CSSProperties> = {
  container: {
    color: Color.Steel,
    display: 'flex',
  },
}
