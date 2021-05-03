import './LocationMarker.css'
import { Formik, FormikHelpers } from 'formik'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import React, { useState } from 'react'
import { LatLng } from 'leaflet'
import { useAddMarker } from '../gql/mutations/useAddMarker'

interface Form {
  description?: string
  name: string
}

const initialValues: Form = {
  description: undefined,
  name: '',
}

const validate = (values: Form) => {
  if (!values.name) {
    return {
      name: strings.required,
    }
  }
}

export const LocationMarker: React.FC = () => {
  const [position, setPosition] = useState<LatLng>()

  const { addMarker } = useAddMarker()

  const map = useMapEvents({
    click(event) {
      setPosition(event.latlng)
      map.flyTo(event.latlng, map.getZoom())
    },
  })

  const onClose = () => {
    setPosition(undefined)
    initialValues.description = undefined
    initialValues.name = ''
  }

  if (!position) {
    return null
  }

  const onSubmit = (values: Form, { setSubmitting }: FormikHelpers<Form>) => {
    setSubmitting(true)
    addMarker(
      {
        ...values,
        latitude: position?.lat,
        longitude: position?.lng,
      },
      () => {
        setSubmitting(false)
        setPosition(undefined)
      },
    )
  }

  return (
    <Marker draggable={true} position={position}>
      <Popup onClose={onClose}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validate}>
          {({
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }) => (
            <form className="location-marker" onSubmit={handleSubmit}>
              <div>
                <label>{strings.name}</label>
                <label className="location-marker-input-label">
                  {errors.name && touched.name ? ' *' : ''}
                </label>
              </div>
              <input
                className={
                  errors.name && touched.name
                    ? 'location-marker-input-error'
                    : 'location-marker-input'
                }
                onBlur={handleBlur}
                onChange={handleChange}
                name="name"
                type="text"
                value={values.name}
              />
              <label>{strings.description}</label>
              <input
                className="location-marker-input"
                onBlur={handleBlur}
                onChange={handleChange}
                name="description"
                type="text"
                value={values.description}
              />
              <button disabled={isSubmitting} type="submit">
                {strings.addEvent}
              </button>
            </form>
          )}
        </Formik>
      </Popup>
    </Marker>
  )
}

const strings = {
  addEvent: 'Agregar Evento',
  description: 'Descripción',
  name: 'Nombre',
  required: 'Requerido',
}
