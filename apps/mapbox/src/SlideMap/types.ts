import { Camera, MapView, MapState } from '@rnmapbox/maps'
import { RefObject } from 'react'
import { SharedValue } from 'react-native-reanimated'

export interface SyncedMapRefs {
  mapRef: RefObject<MapView>
  mapCameraRef: RefObject<Camera>
  refSyncKeyName: string
}

export interface IndicatorValues {
  sharedPressValue: SharedValue<boolean>
  sharedMapClipXValue: SharedValue<number>
  sharedMapClipYValue: SharedValue<number>
}

export interface UseMapSyncProps {
  defaultZoomLevel?: number // number ~1-25 (if I recall)
}

export interface UseMapSyncReturn {
  syncMapRefs: (refs: SyncedMapRefs) => void
  onCameraChanged: (refs: SyncedMapRefs) => (mapState: MapState) => void
}

export enum SlideMode {
  Horizontal = 'Horizontal',
  All = 'All',
}
