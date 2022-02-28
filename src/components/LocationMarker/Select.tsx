import React, { ChangeEventHandler, CSSProperties } from 'react'

import { Label } from '../Label'

interface Props {
  contentContainerStyle?: CSSProperties
  error?: boolean
  label?: string
  name: string
  onChange?: ChangeEventHandler
  placeholder: string
  style?: CSSProperties
  options: {
    id: React.Key
    name: string
  }[]
}

export const Select: React.FunctionComponent<Props> = ({
  contentContainerStyle,
  error,
  label,
  name,
  onChange,
  options,
  placeholder,
  style,
}) => (
  <div style={contentContainerStyle}>
    {label && <Label error={error} label={label} />}
    <select name={name} onChange={onChange} style={style}>
      <option key={0} label={placeholder} value={0} />
      {options.map(category => (
        <option key={category.id} label={category.name} value={category.id} />
      ))}
    </select>
  </div>
)
