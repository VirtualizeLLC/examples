import { FC, useRef, useEffect, PropsWithChildren } from 'react'
import { Camera, MapState, MapView } from '@rnmapbox/maps'
import { useWindowDimensions, StyleSheet, ViewStyle } from 'react-native'
// eslint-disable-next-line import/no-unresolved
import { CameraProps } from '@rnmapbox/maps/lib/typescript/src/components/Camera'
import { SyncedMapRefs, UseMapSyncReturn } from './types'

export interface SyncedMapProps {
  mapProps: MapView['props']
  onCameraChanged: (refs: SyncedMapRefs) => (state: MapState) => void
  cameraProps?: Partial<CameraProps>
  refSyncKeyName: SyncedMapRefs['refSyncKeyName']
  syncMapRefs: UseMapSyncReturn['syncMapRefs']
  mapStyle: ViewStyle[] | ViewStyle
}

const defaultProps = {
  attributionEnabled: false, // see settings for attribution implementation
  logoEnabled: false,
  scaleBarEnabled: false,
  pitchEnabled: false,
  rotateEnabled: false,
  surfaceView: false,
}

export const SyncedMap: FC<PropsWithChildren<SyncedMapProps>> = ({
  onCameraChanged,
  cameraProps = {},
  mapProps,
  syncMapRefs,
  refSyncKeyName,
  mapStyle = {},
  children,
}) => {
  const { width, height } = useWindowDimensions()
  const mapRef = useRef<MapView>(null)
  const mapCameraRef = useRef<Camera>(null)

  useEffect(() => {
    if (refSyncKeyName) syncMapRefs({ refSyncKeyName, mapRef, mapCameraRef })
  }, [refSyncKeyName, syncMapRefs])

  return (
    <MapView
      {...defaultProps}
      {...mapProps}
      onCameraChanged={onCameraChanged({
        refSyncKeyName,
        mapRef,
        mapCameraRef,
      })}
      style={[StyleSheet.flatten(mapStyle), { width, height }]}
      ref={mapRef}
    >
      {children}
      <Camera {...cameraProps} ref={mapCameraRef} />
    </MapView>
  )
}
