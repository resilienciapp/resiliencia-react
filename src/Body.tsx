import React from 'react'

import { useError } from './components/ErrorProvider'
import { Map } from './components/Map'
import { Toast } from './components/Toast'

export const Body: React.FC = () => {
  const { errors } = useError()

  return (
    <div style={styles.container}>
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    bottom: 0,
    left: 0,
    margin: 0,
    padding: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
}
