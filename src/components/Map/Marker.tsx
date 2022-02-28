import { Icon } from 'leaflet'
import { isArray, isNumber, noop } from 'lodash'
import { DateTime } from 'luxon'
import React from 'react'
import { Marker as LeafletMarker, Popup } from 'react-leaflet'
import RRule from 'rrule'

import { chooseColor } from '../../common/colors'
import { strings as commonStrings } from '../../common/strings'
import { Marker as MarkerEntity } from '../../gql/types'
import { Checkbox } from '../Checkbox'

interface Props {
  label: string
  text: string
}

const Item: React.FunctionComponent<Props> = ({ label, text }) => (
  <div style={styles.containerSection}>
    <label style={styles.label}>{`${label}:`}</label>
    <p style={styles.text}>{text}</p>
  </div>
)

const getRecurrence = (recurrenceString: string, duration: number) => {
  const recurrence = RRule.fromString(recurrenceString)

  const startOfDay = DateTime.local().startOf('day').toJSDate()

  const startTime = DateTime.fromJSDate(
    recurrence.after(startOfDay, true) ?? recurrence.before(startOfDay, true),
  )

  const endTime = startTime.plus({ minutes: duration })

  const days = recurrence.options.byweekday
    ? Array(7)
        .fill(noop)
        .map((_, index) =>
          isNumber(recurrence.options.byweekday.find(elem => elem === index))
            ? index
            : undefined,
        )
    : new Date(recurrence.options.dtstart)

  return {
    days,
    endTime,
    startTime,
  }
}

export const Marker: React.FunctionComponent<MarkerEntity> = ({
  category,
  description,
  duration,
  latitude,
  longitude,
  name,
  recurrence,
}) => {
  const info = getRecurrence(recurrence, duration)

  return (
    <LeafletMarker
      icon={
        new Icon({
          iconSize: [30, 30],
          iconUrl: chooseColor(category.color),
        })
      }
      position={[latitude, longitude]}
      title={name}>
      <Popup>
        <div style={styles.container}>
          <Item label={commonStrings.name} text={name} />
          <Item label={commonStrings.category} text={category.name} />
          {description && (
            <Item label={commonStrings.description} text={description} />
          )}
          {isArray(info.days) ? (
            <div style={styles.containerSection}>
              <label style={styles.label}>{`${commonStrings.days}:`}</label>
              <div style={styles.containerDays}>
                <Checkbox
                  checked={Boolean(info.days[0])}
                  disabled={true}
                  label="Lu"
                  value={info.days[0]}
                />
                <Checkbox
                  checked={Boolean(info.days[1])}
                  disabled={true}
                  label="Ma"
                  value={info.days[1]}
                />
                <Checkbox
                  checked={Boolean(info.days[2])}
                  disabled={true}
                  label="Mi"
                  value={info.days[2]}
                />
                <Checkbox
                  checked={Boolean(info.days[3])}
                  disabled={true}
                  label="Ju"
                  value={info.days[3]}
                />
                <Checkbox
                  checked={Boolean(info.days[4])}
                  disabled={true}
                  label="Vi"
                  value={info.days[4]}
                />
                <Checkbox
                  checked={Boolean(info.days[5])}
                  disabled={true}
                  label="Sá"
                  value={info.days[5]}
                />
                <Checkbox
                  checked={Boolean(info.days[6])}
                  disabled={true}
                  label="Do"
                  value={info.days[6]}
                />
              </div>
            </div>
          ) : (
            <Item
              label={commonStrings.date}
              text={info.days.toLocaleDateString()}
            />
          )}
          <label style={styles.label}>{`${commonStrings.schedule}:`}</label>
          {info.startTime.toLocaleString(DateTime.TIME_SIMPLE)} {' - '}{' '}
          {info.endTime.toLocaleString(DateTime.TIME_SIMPLE)}
        </div>
      </Popup>
    </LeafletMarker>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  containerDays: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '2.5%',
  },
  containerSection: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '2%',
    marginTop: '2%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '1%',
  },
  text: {
    marginBottom: 0,
    marginTop: 0,
  },
}
