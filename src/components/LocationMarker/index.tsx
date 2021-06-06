import './LocationMarker.css'

import { Form, Formik } from 'formik'
import { LatLng, Marker as LeafletMarker } from 'leaflet'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'

import { useAddMarker } from '../../gql/mutations/useAddMarker'
import { useCategories } from '../../gql/queries/useCategories'

interface Form {
  category: string
  description?: string
  name: string
  recurrence: string
}

const initialValues: Form = {
  category: '0',
  description: undefined,
  name: '',
  recurrence: '',
}

interface Errors {
  category?: string
  name?: string
}

const validate = (values: Form) => {
  const errors: Errors = {}

  if (!values.name) {
    errors.name = strings.required
  }
  if (values.category === '0') {
    errors.category = strings.required
  }

  return errors
}

interface Props {
  saveMarkers: CallableFunction
}

export const LocationMarker: React.FC<Props> = ({ saveMarkers }) => {
  const [position, setPosition] = useState<LatLng>()
  const { addMarker } = useAddMarker()
  const markerRef = useRef<LeafletMarker>(null)

  const data = useCategories()

  const map = useMapEvents({
    click(event) {
      setPosition(event.latlng)
      map.flyTo(event.latlng, map.getZoom())
    },
  })

  const onClose = useCallback(() => {
    setPosition(undefined)
    initialValues.description = undefined
    initialValues.name = ''
  }, [])

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        if (markerRef.current !== null) {
          setPosition(markerRef.current.getLatLng())
        }
      },
    }),
    [],
  )

  if (!position) {
    return null
  }

  const onSubmit = async (values: Form) => {
    const { data } = await addMarker({
      category: Number(values.category),
      description: values.description,
      latitude: position.lat,
      longitude: position.lng,
      name: values.name,
      recurrence: '',
    })

    if (data?.addMarker.length) {
      saveMarkers(data?.addMarker)
      onClose()
    }
  }

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}>
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
            <Form className="location-marker" onSubmit={handleSubmit}>
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
              <div>
                <label>{strings.category}</label>
                <label className="location-marker-input-label">
                  {errors.category && touched.category ? ' *' : ''}
                </label>
              </div>
              <select name="category" onChange={handleChange}>
                <option key={0} label={strings.selectCategory} value={0} />
                {data?.categories.map(category => (
                  <option
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </select>
              <button disabled={isSubmitting} type="submit">
                {strings.addEvent}
              </button>
            </Form>
          )}
        </Formik>
      </Popup>
    </Marker>
  )
}

const strings = {
  addEvent: 'Agregar Evento',
  category: 'Categoría',
  description: 'Descripción',
  name: 'Nombre',
  required: 'Requerido',
  selectCategory: '--Categoría--',
}
