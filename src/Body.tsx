import './Body.css'

import React from 'react'

import { useError } from './components/ErrorProvider'
import { Map } from './components/Map'
import { Toast } from './components/Toast'

export const Body: React.FC = () => {
  const { errors } = useError()

  return (
    <div className="body-container">
      <Toast
        autoDelete={true}
        dismissTime={4000}
        position="top-right"
        toastList={errors}
      />
      <Map />
    </div>
  )
}
