import { Form, Formik } from 'formik'
import { LatLng, Marker as LeafletMarker } from 'leaflet'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { RRule } from 'rrule'

import { strings as commonStrings } from '../../common/strings'
import { useAddMarker } from '../../gql/mutations/useAddMarker'
import { useCategories } from '../../gql/queries/useCategories'
import { Color } from '../../style'
import { Checkbox } from './Checkbox'
import { Label } from './Label'

interface Form {
  category: string
  days: string[]
  description?: string
  duration: number
  name: string
  recurrent: string
  startTime: string
}

const initialValues: Form = {
  category: '0',
  days: Array(7).fill(false),
  duration: 0,
  name: '',
  recurrent: '',
  startTime: '',
}

const validations: Record<keyof Form, CallableFunction> = {
  category: (category: string) => category === '0',
  days: (days: boolean[]) => !days.find(day => day),
  description: () => false,
  duration: (duration: number) => !duration,
  name: (name: string) => !name,
  recurrent: () => false,
  startTime: (startTime: string) => !startTime,
}

const validate = (values: Form) =>
  Object.fromEntries(
    Object.entries(values)
      .map(([key, value]) => [key, validations[key as keyof Form](value)])
      .filter(value => value[1]),
  )

interface Props {
  saveMarkers: CallableFunction
}

const generateRecurrence = (values: Form): string => {
  const [byhour, byminute] = values.startTime
    .split(':')
    .map(value => Number(value))

  const byweekday = [
    RRule.MO,
    RRule.TU,
    RRule.WE,
    RRule.TH,
    RRule.FR,
    RRule.SA,
    RRule.SU,
  ].filter((_, index) => values.days[index])

  if (values.recurrent) {
    return new RRule({
      byhour,
      byminute,
      byweekday,
    }).toString()
  }

  const dtstart = new Date()
  dtstart.setHours(byhour)
  dtstart.setMinutes(byminute)
  dtstart.setSeconds(0)

  return new RRule({
    byweekday,
    count: byweekday.length,
    dtstart,
  }).toString()
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
      duration: values.duration,
      latitude: position.lat,
      longitude: position.lng,
      name: values.name,
      recurrence: generateRecurrence(values),
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
            isValid,
            touched,
            values,
          }) => (
            <Form style={styles.container} onSubmit={handleSubmit}>
              <Label
                label={commonStrings.name}
                error={Boolean(errors.name && touched.name)}
              />
              <input
                style={
                  errors.name && touched.name ? styles.inputError : styles.input
                }
                onBlur={handleBlur}
                onChange={handleChange}
                name="name"
                type="text"
                value={values.name}
              />
              <Label label={commonStrings.description} />
              <input
                style={styles.input}
                onBlur={handleBlur}
                onChange={handleChange}
                name="description"
                type="text"
                value={values.description}
              />
              <Label
                label={commonStrings.category}
                error={Boolean(errors.category && touched.category)}
              />
              <select
                style={
                  errors.category && touched.category
                    ? styles.inputError
                    : styles.input
                }
                name="category"
                onChange={handleChange}>
                <option key={0} label={strings.selectCategory} value={0} />
                {data?.categories.map(category => (
                  <option
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </select>
              <div style={styles.containerDateTime}>
                <Label
                  label={commonStrings.days}
                  error={Boolean(errors.days && touched.days)}
                />
                <div style={styles.containerDate}>
                  <Checkbox
                    error={Boolean(errors.days && touched.days)}
                    label="Lu"
                    name="days[0]"
                    onChange={handleChange}
                    value={values.days[0]}
                  />
                  <Checkbox
                    error={Boolean(errors.days && touched.days)}
                    label="Ma"
                    name="days[1]"
                    onChange={handleChange}
                    value={values.days[1]}
                  />
                  <Checkbox
                    error={Boolean(errors.days && touched.days)}
                    label="Mi"
                    name="days[2]"
                    onChange={handleChange}
                    value={values.days[2]}
                  />
                  <Checkbox
                    error={Boolean(errors.days && touched.days)}
                    label="Ju"
                    name="days[3]"
                    onChange={handleChange}
                    value={values.days[3]}
                  />
                  <Checkbox
                    error={Boolean(errors.days && touched.days)}
                    label="Vi"
                    name="days[4]"
                    onChange={handleChange}
                    value={values.days[4]}
                  />
                  <Checkbox
                    error={Boolean(errors.days && touched.days)}
                    label="Sá"
                    name="days[5]"
                    onChange={handleChange}
                    value={values.days[5]}
                  />
                  <Checkbox
                    error={Boolean(errors.days && touched.days)}
                    label="Do"
                    name="days[6]"
                    onChange={handleChange}
                    value={values.days[6]}
                  />
                </div>
                <Label
                  label={commonStrings.startTime}
                  error={Boolean(errors.startTime && touched.startTime)}
                />
                <input
                  name="startTime"
                  onChange={handleChange}
                  style={
                    errors.startTime && touched.startTime
                      ? styles.inputError
                      : styles.input
                  }
                  type="time"
                  value={values.startTime}
                />
                <Label
                  label={commonStrings.end}
                  error={Boolean(errors.duration && touched.duration)}
                />
                <input
                  name="duration"
                  onChange={handleChange}
                  style={
                    errors.duration && touched.duration
                      ? styles.durationError
                      : styles.duration
                  }
                  type="number"
                  value={values.duration}
                />
              </div>
              <div style={styles.recurrent}>
                <Label label={strings.recurrent} />
                <div style={styles.containerDate}>
                  <Checkbox
                    name="recurrent"
                    onChange={handleChange}
                    value={values.recurrent}
                  />
                </div>
              </div>
              <button disabled={isSubmitting || !isValid} type="submit">
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
  recurrent: 'Recurrente semanal',
  required: 'Requerido',
  selectCategory: '--Categoría--',
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  containerDate: {
    alignItems: 'center',
    display: 'flex',
    marginBottom: '5%',
    padding: '1.5%',
  },
  containerDateTime: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  duration: {
    border: '1px solid',
    borderColor: Color.LightGray,
    borderRadius: '3px',
    color: Color.Steel,
    marginBottom: '5%',
    marginRight: '1%',
    textAlign: 'center',
    width: '5rem',
  },
  durationError: {
    border: '1px solid',
    borderColor: Color.Reddish,
    borderRadius: '3px',
    color: Color.Steel,
    marginBottom: '5%',
    marginRight: '1%',
    textAlign: 'center',
    width: '5rem',
  },
  input: {
    border: '1px solid',
    borderColor: Color.LightGray,
    borderRadius: '3px',
    color: Color.Steel,
    marginBottom: '5%',
  },
  inputError: {
    border: '1px solid',
    borderColor: Color.Reddish,
    borderRadius: '3px',
    color: Color.Steel,
    marginBottom: '5%',
  },
  recurrent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '5%',
  },
}
