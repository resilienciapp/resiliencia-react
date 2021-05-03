import './Body.css'
import { Map } from './components/Map'
import React from 'react'
import { Toast } from './components/Toast'
import { useError } from './components/ErrorProvider'

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
