import React, {
  ChangeEventHandler,
  CSSProperties,
  FocusEventHandler,
} from 'react'

import { Label } from '../Label'

interface Props {
  contentContainerStyle?: CSSProperties
  disabled?: boolean
  error?: boolean
  label?: string
  name: string
  onBlur?: FocusEventHandler
  onChange?: ChangeEventHandler
  style?: CSSProperties
  type: string
  value?: string
}

export const Input: React.FunctionComponent<Props> = ({
  contentContainerStyle,
  disabled = false,
  error,
  label,
  name,
  onBlur,
  onChange,
  style,
  type,
  value,
}) => (
  <div style={contentContainerStyle}>
    {label && <Label error={error} label={label} />}
    <input
      disabled={disabled}
      onBlur={onBlur}
      onChange={onChange}
      name={name}
      style={style}
      type={type}
      value={value}
    />
  </div>
)
