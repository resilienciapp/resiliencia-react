import * as Leaflet from 'leaflet'
import { clamp, groupBy, identity, isNumber } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { LayersControl, MapContainer, TileLayer } from 'react-leaflet'

import add from '../../assets/add.svg'
import { ReactComponent as ArrowDown } from '../../assets/keyboard_arrow_down.svg'
import { ReactComponent as ArrowUp } from '../../assets/keyboard_arrow_up.svg'
import { useMarkers } from '../../gql/queries/useMarkers'
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

export const Map: React.FC = () => {
  const inputFile = useRef<HTMLInputElement>(null)

  const [markers, setMarkers] = useState<MarkerEntity[]>([])

  const [heatMapPoints, setHeatMapPoints] = useState<
    Leaflet.HeatLatLngTuple[][]
  >([])

  const [heatMapInfo, setHeatMapInfo] = useState<HeatMap[]>([
    {
      checked: false,
      gradient: {
        0.5: Color.LimeGreen,
        0.75: Color.Yellow,
        1: Color.Reddish,
      },
      name: 'Mapa de calor de eventos',
      radius: 25,
    },
  ])

  useMarkers(setMarkers)

  useEffect(() => {
    const newHeatMapPoints = [...heatMapPoints]

    newHeatMapPoints[0] = markers.map(({ latitude, longitude }) => [
      latitude,
      longitude,
      0.1,
    ])

    setHeatMapPoints(newHeatMapPoints)
  }, [markers.length])

  const toggleHeatMap = (index: number) => () => {
    const newHeatMapInfo = [...heatMapInfo]

    newHeatMapInfo[index].checked = !newHeatMapInfo[index].checked

    setHeatMapInfo(newHeatMapInfo)
  }

  const changeRadius = (index: number) => (event: any) => {
    const radius = Number(event.target.value)

    if (!isNumber(radius)) {
      return
    }

    const newHeatMapInfo = [...heatMapInfo]

    newHeatMapInfo[index].radius = clamp(radius, 0, 100)

    setHeatMapInfo(newHeatMapInfo)
  }

  const changeGradient =
    (index: number, key: 0.5 | 0.75 | 1) => (event: any) => {
      const newHeatMapInfo = [...heatMapInfo]

      newHeatMapInfo[index].gradient[key] = event.target.value

      setHeatMapInfo(newHeatMapInfo)
    }

  const groupedMarkers = groupBy(markers, 'category.name')

  const onButtonClick = () => {
    inputFile.current?.click()
  }

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
            {
              checked: false,
              gradient: {
                0.5: Color.LimeGreen,
                0.75: Color.Yellow,
                1: Color.Reddish,
              },
              name: event.target.files[0].name,
              radius: 25,
            },
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
        {heatMapInfo.map(({ checked, gradient, name, radius }, index) => (
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
                  onChange={changeGradient(index, 0.5)}
                  value={gradient[0.5]}
                />
                <TableElement
                  label="0.75"
                  onChange={changeGradient(index, 0.75)}
                  value={gradient[0.75]}
                />
                <TableElement
                  label="1"
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
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <div
        onClick={onButtonClick}
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
          {Object.keys(groupedMarkers).map(key => (
            <LayersControl.Overlay checked={true} key={key} name={key}>
              {groupedMarkers[key].map(marker => (
                <Marker key={marker.id} {...marker} />
              ))}
            </LayersControl.Overlay>
          ))}
        </LayersControl>

        {heatMapPoints.map((points, index) => {
          if (heatMapInfo[index].checked)
            return <HeatLayer points={points} info={heatMapInfo[index]} />
        })}
      </MapContainer>
    </>
  )
}
