import * as Leaflet from 'leaflet'
import { clamp, groupBy, identity, isNumber } from 'lodash'
import React, { useRef, useState } from 'react'
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  TileLayer,
} from 'react-leaflet'

import add from '../../assets/add.svg'
import file_download from '../../assets/file_download.svg'
import { ReactComponent as ArrowDown } from '../../assets/keyboard_arrow_down.svg'
import { ReactComponent as ArrowUp } from '../../assets/keyboard_arrow_up.svg'
import { useMarkers } from '../../gql/queries/useMarkers'
import { useMarkersAnalytics } from '../../gql/queries/useMarkersAnalytics'
import { Marker as MarkerEntity } from '../../gql/types'
import { Color } from '../../style'
import { Checkbox } from '../Checkbox'
import { LocationMarker } from '../LocationMarker'
import { HeatLayer } from './HeatLayer'
import { Marker } from './Marker'
import { TableElement } from './TableElement'

interface HeatMap {
  checked: boolean
  gradient: {
    0.5: Color
    0.75: Color
    1: Color
  }
  name: string
  radius: number
}

interface MarkerGroup {
  checked: boolean
  markers: MarkerEntity[]
  name: string
}

const getDefaultConfig = () => ({
  checked: false,
  gradient: {
    0.5: Color.LimeGreen,
    0.75: Color.Yellow,
    1: Color.Reddish,
  },
  radius: 25,
})

export const Map: React.FC = () => {
  const inputFile = useRef<HTMLInputElement>(null)

  const [editionHeatMapInfo, setEditionHeatMapInfo] = useState<HeatMap[]>([])
  const [markerGroups, setMarkerGroups] = useState<MarkerGroup[]>([])
  const [heatMapInfo, setHeatMapInfo] = useState<HeatMap[]>([])
  const [heatMapPoints, setHeatMapPoints] = useState<
    Leaflet.HeatLatLngTuple[][]
  >([])

  const { getMarkersAnalyticsData } = useMarkersAnalytics()

  const storeMarkers = (markers: MarkerEntity[]) => {
    const newHeatMapPoints: Leaflet.HeatLatLngTuple[][] = [[]]
    const newHeatMapInfo: HeatMap[] = [{ ...getDefaultConfig(), name: 'Todos' }]
    const groups = groupBy(markers, 'category.name')

    const markerGroups = Object.keys(groups).map(key => ({
      checked: true,
      markers: groups[key],
      name: key,
    }))

    markerGroups.forEach(({ markers, name }) => {
      newHeatMapInfo.push({ ...getDefaultConfig(), name })

      const points: Leaflet.HeatLatLngTuple[] = markers.map(
        ({ latitude, longitude }) => [latitude, longitude, 1],
      )

      newHeatMapPoints[0] = newHeatMapPoints[0].concat(points)
      newHeatMapPoints.push(points)
    })

    setHeatMapInfo(newHeatMapInfo)
    setHeatMapPoints(newHeatMapPoints)
    setMarkerGroups(markerGroups)
  }

  useMarkers(storeMarkers)

  const toggleHeatMap = (index: number) => () => {
    const newHeatMapInfo = [...heatMapInfo]
    newHeatMapInfo[index].checked = !newHeatMapInfo[index].checked
    setHeatMapInfo(newHeatMapInfo)

    if (editionHeatMapInfo.length !== 0) {
      const newEditionHeatMapInfo = [...editionHeatMapInfo]
      newEditionHeatMapInfo[index].checked =
        !newEditionHeatMapInfo[index].checked
      setEditionHeatMapInfo(newEditionHeatMapInfo)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeRadius = (index: number) => (event: any) => {
    const radius = Number(event.target.value)

    if (!isNumber(radius) || isNaN(radius)) {
      return
    }

    const newRadius = clamp(radius, 0, 100)

    const newHeatMapInfo = [...heatMapInfo]
    newHeatMapInfo[index].radius = newRadius
    setHeatMapInfo(newHeatMapInfo)

    if (editionHeatMapInfo.length !== 0) {
      const newEditionHeatMapInfo = [...editionHeatMapInfo]
      newEditionHeatMapInfo[index].radius = newRadius
      setEditionHeatMapInfo(newEditionHeatMapInfo)
    }
  }

  const changeGradient =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (index: number, key: 0.5 | 0.75 | 1) => (event: any) => {
      const newHeatMapInfo = [...heatMapInfo]

      newHeatMapInfo[index] = {
        ...newHeatMapInfo[index],
        gradient: {
          ...newHeatMapInfo[index].gradient,
          [key]: event.target.value,
        },
      }

      setEditionHeatMapInfo(newHeatMapInfo)
    }

  const onBlur = () => {
    if (editionHeatMapInfo.length) {
      const hasErrors = editionHeatMapInfo.find(element =>
        Object.values(element.gradient).find(
          color => !/^#[0-9A-F]{6}$/i.test(color),
        ),
      )

      if (!hasErrors) {
        setHeatMapInfo(editionHeatMapInfo)
        setEditionHeatMapInfo([])
      }
    }
  }

  const loadPoints = () => {
    inputFile.current?.click()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (event: any) => {
    event.stopPropagation()
    event.preventDefault()

    const reader = new FileReader()
    reader.onload = async ({ target }) => {
      if (target?.result) {
        try {
          const arrayOfPoints = (target.result as string)
            .split('\n')
            .filter(identity)
            .map(line => JSON.parse(line)) as Leaflet.HeatLatLngTuple[]

          setHeatMapInfo([
            ...heatMapInfo,
            { ...getDefaultConfig(), name: event.target.files[0].name },
          ])
          setHeatMapPoints([...heatMapPoints, arrayOfPoints])
        } catch {
          alert('Error cargando el archivo')
        }
      }
    }
    reader.readAsText(event.target.files[0])
  }

  const moveUp = (index: number) => () => {
    if (index === 0) {
      return
    }

    const newHeatMapInfo = [...heatMapInfo]
    const tmp = newHeatMapInfo[index - 1]
    newHeatMapInfo[index - 1] = newHeatMapInfo[index]
    newHeatMapInfo[index] = tmp

    const newHeatMapPoints = [...heatMapPoints]
    const tmp2 = newHeatMapPoints[index - 1]
    newHeatMapPoints[index - 1] = newHeatMapPoints[index]
    newHeatMapPoints[index] = tmp2

    setHeatMapInfo(newHeatMapInfo)
    setHeatMapPoints(newHeatMapPoints)
  }

  const moveDown = (index: number) => () => {
    if (index === heatMapInfo.length - 1) {
      return
    }

    const newHeatMapInfo = [...heatMapInfo]
    const tmp = newHeatMapInfo[index + 1]
    newHeatMapInfo[index + 1] = newHeatMapInfo[index]
    newHeatMapInfo[index] = tmp

    const newHeatMapPoints = [...heatMapPoints]
    const tmp2 = newHeatMapPoints[index + 1]
    newHeatMapPoints[index + 1] = newHeatMapPoints[index]
    newHeatMapPoints[index] = tmp2

    setHeatMapInfo(newHeatMapInfo)
    setHeatMapPoints(newHeatMapPoints)
  }

  return (
    <>
      {heatMapInfo.length !== 0 && (
        <div
          style={{
            backgroundColor: 'white',
            border: '2px solid rgba(0,0,0,0.2)',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            left: 0,
            marginLeft: '10px',
            marginTop: '10px',
            maxWidth: 500,
            paddingBottom: '8px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '8px',
            position: 'absolute',
            top: 75,
            zIndex: 1000,
          }}>
          {(editionHeatMapInfo.length === 0
            ? heatMapInfo
            : editionHeatMapInfo
          ).map(({ checked, gradient, name, radius }, index) => (
            <div
              key={index}
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Checkbox
                checked={checked}
                contentContainerStyle={{
                  alignSelf: 'flex-end',
                  flex: 1,
                  paddingBottom: '4px',
                }}
                titleStyle={{ fontSize: 13 }}
                label={name}
                onChange={toggleHeatMap(index)}
              />
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <TableElement
                  label="Radio"
                  onBlur={onBlur}
                  onChange={changeRadius(index)}
                  style={{ marginLeft: '8px', width: '30px' }}
                  value={radius}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: '8px',
                    marginRight: '8px',
                  }}>
                  <TableElement
                    label="0.5"
                    onBlur={onBlur}
                    onChange={changeGradient(index, 0.5)}
                    value={gradient[0.5]}
                  />
                  <TableElement
                    label="0.75"
                    onBlur={onBlur}
                    onChange={changeGradient(index, 0.75)}
                    value={gradient[0.75]}
                  />
                  <TableElement
                    label="1"
                    onBlur={onBlur}
                    onChange={changeGradient(index, 1)}
                    value={gradient[1]}
                  />
                </div>
              </div>
              <ArrowUp
                fill={index === 0 ? Color.White : Color.Black}
                onClick={moveUp(index)}
                style={{ height: '15px', paddingTop: '15px', width: '15px' }}
              />
              <ArrowDown
                fill={
                  index === heatMapInfo.length - 1 || heatMapInfo.length === 1
                    ? Color.White
                    : Color.Black
                }
                onClick={moveDown(index)}
                style={{ height: '15px', paddingTop: '15px', width: '15px' }}
              />
            </div>
          ))}
        </div>
      )}
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <div
        onClick={loadPoints}
        style={{
          backgroundColor: 'white',
          border: '2px solid rgba(0,0,0,0.2)',
          borderRadius: '5px',
          bottom: 50,
          display: 'flex',
          height: '44px',
          marginBottom: '10px',
          marginRight: '10px',
          padding: '12px',
          position: 'absolute',
          right: 40,
          width: '44px',
          zIndex: 1000,
        }}>
        <img alt="" src={add} />
      </div>
      <div
        onClick={() => getMarkersAnalyticsData()}
        style={{
          backgroundColor: 'white',
          border: '2px solid rgba(0,0,0,0.2)',
          borderRadius: '5px',
          display: 'flex',
          height: '37px',
          left: '50px',
          marginBottom: '10px',
          marginRight: '10px',
          padding: '12px',
          position: 'absolute',
          top: '10px',
          width: '37px',
          zIndex: 1000,
        }}>
        <img alt="" src={file_download} />
      </div>

      <MapContainer
        center={[-34.895376, -56.187666] as Leaflet.LatLngExpression}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        style={{ height: '100vh' }}
        touchZoom={true}
        zoom={13}
        zoomAnimation={true}
        zoomControl={true}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked={true} name="Estándard">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topológico">
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
              maxZoom={17}
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LocationMarker />
          {markerGroups.map(markerGroup => (
            <LayersControl.Overlay
              checked={true}
              key={markerGroup.name}
              name={markerGroup.name}>
              <LayerGroup>
                {markerGroup.markers.map(marker => (
                  <Marker key={marker.id} {...marker} />
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          ))}
        </LayersControl>
        {heatMapInfo.map(({ checked, name }, index) => {
          if (checked)
            return (
              <HeatLayer
                key={name + checked}
                points={heatMapPoints[index]}
                info={heatMapInfo[index]}
              />
            )
        })}
      </MapContainer>
    </>
  )
}
