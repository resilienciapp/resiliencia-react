import './index.css'

import React, { CSSProperties } from 'react'

import { Color } from '../../style'
import { Label } from '../Label'

interface Props {
  checked: boolean
  contentContainerStyle?: CSSProperties
  disabled?: boolean
  error?: boolean
  label?: string
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  style?: CSSProperties
  title?: string
  titleStyle?: CSSProperties
  value?: string | number
}

export const Checkbox: React.FunctionComponent<Props> = ({
  checked,
  contentContainerStyle,
  disabled = false,
  error = false,
  label,
  name,
  onChange,
  style,
  title,
  titleStyle,
  value,
}) => (
  <div style={contentContainerStyle}>
    {title && <Label error={error} label={title} style={titleStyle} />}
    <label style={{ ...styles.container, ...titleStyle }}>
      <input
        checked={checked}
        disabled={disabled}
        name={name}
        onChange={onChange}
        required={error}
        style={style}
        type="checkbox"
        value={value}
      />
      <span />
      {label}
    </label>
  </div>
)

const styles: Record<string, React.CSSProperties> = {
  container: {
    color: Color.Steel,
    display: 'flex',
    marginRight: '0.25rem',
  },
}
