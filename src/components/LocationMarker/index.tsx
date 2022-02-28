import { Form, Formik } from 'formik'
import { Icon, LatLng, Marker as LeafletMarker } from 'leaflet'
import { DateTime } from 'luxon'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { RRule } from 'rrule'

import placeBlue from '../../assets/placeBlue.svg'
import { strings as commonStrings } from '../../common/strings'
import { useAddMarker } from '../../gql/mutations/useAddMarker'
import { useCategories } from '../../gql/queries/useCategories'
import { Color } from '../../style'
import { Checkbox } from '../Checkbox'
import { Label } from '../Label'
import { Input } from './Input'
import { Select } from './Select'

interface Form {
  allDay: string
  category: string
  days: string[]
  description?: string
  endTime?: string
  name: string
  recurrent: string
  startTime?: string
}

const initialValues: Form = {
  allDay: '',
  category: '0',
  days: Array(7).fill(false),
  endTime: '',
  name: '',
  recurrent: '',
  startTime: '',
}

const validations: Record<keyof Form, CallableFunction> = {
  allDay: ({ allDay, endTime, startTime }: Form) =>
    !allDay && !(startTime || endTime),
  category: ({ category }: Form) => category === '0',
  days: ({ days }: Form) => !days.some(days => days),
  description: () => false,
  endTime: ({ allDay, endTime, startTime }: Form) =>
    (!allDay && !endTime) ||
    (endTime &&
      startTime &&
      Date.parse('' + startTime) < Date.parse('' + endTime)),
  name: ({ name }: Form) => !name,
  recurrent: () => false,
  startTime: ({ allDay, startTime }: Form) => !allDay && !startTime,
}

const validate = (values: Form) =>
  Object.fromEntries(
    Object.entries(values)
      .map(([key]) => [key, validations[key as keyof Form](values)])
      .filter(value => value[1]),
  )

const generateRecurrence = (values: Form) => {
  const [byhour, byminute] = values.allDay
    ? [0, 0]
    : values.startTime?.split(':').map(value => Number(value)) ?? [0, 0]

  const [byEndhour, byEndminute] = values.allDay
    ? [23, 59]
    : values.endTime?.split(':').map(value => Number(value)) ?? [24, 0]

  const duration = (byEndhour - byhour) * 60 + (byEndminute - byminute)

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
    return {
      duration,
      recurrence: new RRule({
        byhour,
        byminute,
        byweekday,
      }).toString(),
    }
  }

  const dtstart = new Date()
  dtstart.setHours(byhour)
  dtstart.setMinutes(byminute)
  dtstart.setSeconds(0)

  return {
    duration,
    recurrence: new RRule({
      byweekday,
      count: byweekday.length,
      dtstart,
    }).toString(),
  }
}

export const LocationMarker: React.FC = () => {
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
      timeZone: DateTime.local().zoneName,
      ...generateRecurrence(values),
    })

    if (data?.addMarker) {
      onClose()
    }
  }

  return (
    <Marker
      draggable={true}
      icon={
        new Icon({
          iconSize: [30, 30],
          iconUrl: placeBlue,
        })
      }
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
            setFieldValue,
            touched,
            values,
          }) => (
            <Form style={styles.container} onSubmit={handleSubmit}>
              <Input
                contentContainerStyle={styles.inputContainer}
                error={Boolean(errors.name && touched.name)}
                label={commonStrings.name}
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.name && touched.name ? styles.error : {}),
                }}
                type="text"
                value={values.name}
              />
              <Input
                contentContainerStyle={styles.inputContainer}
                label={commonStrings.description}
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                style={styles.input}
                type="text"
                value={values.description}
              />
              <Select
                contentContainerStyle={styles.inputContainer}
                error={Boolean(errors.category && touched.category)}
                label={commonStrings.category}
                name="category"
                onChange={handleChange}
                placeholder={strings.selectCategory}
                options={data?.categories ?? []}
                style={{
                  ...styles.input,
                  ...(errors.category && touched.category ? styles.error : {}),
                }}
              />
              <div style={styles.containerDateTime}>
                <Label
                  label={commonStrings.days}
                  error={Boolean(errors.days && touched.days)}
                />
                <div style={styles.containerDate}>
                  <Checkbox
                    checked={Boolean(values.days[0])}
                    error={Boolean(errors.days && touched.days)}
                    label="Lu"
                    name="days[0]"
                    onChange={handleChange}
                    value={values.days[0]}
                  />
                  <Checkbox
                    checked={Boolean(values.days[1])}
                    error={Boolean(errors.days && touched.days)}
                    label="Ma"
                    name="days[1]"
                    onChange={handleChange}
                    value={values.days[1]}
                  />
                  <Checkbox
                    checked={Boolean(values.days[2])}
                    error={Boolean(errors.days && touched.days)}
                    label="Mi"
                    name="days[2]"
                    onChange={handleChange}
                    value={values.days[2]}
                  />
                  <Checkbox
                    checked={Boolean(values.days[3])}
                    error={Boolean(errors.days && touched.days)}
                    label="Ju"
                    name="days[3]"
                    onChange={handleChange}
                    value={values.days[3]}
                  />
                  <Checkbox
                    checked={Boolean(values.days[4])}
                    error={Boolean(errors.days && touched.days)}
                    label="Vi"
                    name="days[4]"
                    onChange={handleChange}
                    value={values.days[4]}
                  />
                  <Checkbox
                    checked={Boolean(values.days[5])}
                    error={Boolean(errors.days && touched.days)}
                    label="Sá"
                    name="days[5]"
                    onChange={handleChange}
                    value={values.days[5]}
                  />
                  <Checkbox
                    checked={Boolean(values.days[6])}
                    error={Boolean(errors.days && touched.days)}
                    label="Do"
                    name="days[6]"
                    onChange={handleChange}
                    value={values.days[6]}
                  />
                </div>
                <Checkbox
                  checked={Boolean(values.allDay)}
                  contentContainerStyle={styles.inputContainer}
                  error={Boolean(errors.allDay && touched.allDay)}
                  name="allDay"
                  onChange={event => {
                    setFieldValue('startTime', initialValues.startTime)
                    setFieldValue('endTime', initialValues.endTime)
                    handleChange(event)
                  }}
                  title={strings.allDay}
                  value={values.allDay}
                />
                <Input
                  contentContainerStyle={styles.inputContainer}
                  error={Boolean(errors.startTime && touched.startTime)}
                  label={commonStrings.startTime}
                  name="startTime"
                  onChange={event => {
                    setFieldValue('allDay', initialValues.allDay)
                    handleChange(event)
                  }}
                  style={{
                    ...styles.input,
                    ...(errors.startTime && touched.startTime
                      ? styles.error
                      : {}),
                  }}
                  type="time"
                  value={values.startTime}
                />
                <Input
                  contentContainerStyle={styles.inputContainer}
                  error={Boolean(errors.endTime && touched.endTime)}
                  label={commonStrings.endTime}
                  name="endTime"
                  onChange={event => {
                    setFieldValue('allDay', initialValues.allDay)
                    handleChange(event)
                  }}
                  style={{
                    ...styles.input,
                    ...(errors.endTime && touched.endTime ? styles.error : {}),
                  }}
                  type="time"
                  value={values.endTime}
                />
              </div>
              <Checkbox
                checked={Boolean(values.recurrent)}
                contentContainerStyle={styles.inputContainer}
                name="recurrent"
                onChange={handleChange}
                title={strings.recurrent}
                value={values.recurrent}
              />
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
  allDay: 'Todo el día',
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
  error: {
    borderColor: Color.Reddish,
  },
  input: {
    border: '1px solid',
    borderColor: Color.LightGray,
    borderRadius: '3px',
    color: Color.Steel,
  },
  inputContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '5%',
  },
  recurrent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '5%',
  },
}
