import { useCallback, useRef } from 'react'
import { SyncedMapRefs, UseMapSyncProps, UseMapSyncReturn } from './types'

export const useMapSync = ({ defaultZoomLevel = 8 }: UseMapSyncProps = {}) => {
  const syncedMapRefs = useRef<Map<string, SyncedMapRefs>>(new Map())
  const sharedZoomRef = useRef(defaultZoomLevel)

  /**
   * @description This is used to bind maps once they are ready
   * @param refs
   * @returns
   */
  const syncMapRefs: UseMapSyncReturn['syncMapRefs'] = useCallback((refs) => {
    if (!refs.refSyncKeyName) {
      console.error('syncMapRefs() error, must provide a refSyncKeyName')
      return
    }
    if (!syncedMapRefs.current) return
    if (!syncedMapRefs.current?.get(refs.refSyncKeyName)) {
      syncedMapRefs.current.set(refs.refSyncKeyName, refs)
    }
  }, [])

  /**
   * Synchronizes both maps
   * - This will synchronize the other map that is not being actively moved
   * @note This synchronization includes both user and non user trigger map changes
   */
  const onCameraChanged: UseMapSyncReturn['onCameraChanged'] = useCallback(
    ({ refSyncKeyName }) =>
      (state) => {
        if (!refSyncKeyName) {
          console.warn('No refSyncKeyName provided will not sync')
          return
        }

        if (!state?.gestures?.isGestureActive) {
          return
        }

        if (!sharedZoomRef.current) {
          console.error('Error occurred with handleMapSync, refs are invalid')
          return
        }

        const { center, zoom } = state.properties

        if (!center || !zoom) {
          return
        }

        sharedZoomRef.current = zoom

        const refEntries = syncedMapRefs.current?.entries()

        if (!refEntries) return
        const refsToSync: [SyncedMapRefs['refSyncKeyName'], SyncedMapRefs][] = [
          ...refEntries,
        ]

        for (const [key, { mapCameraRef, mapRef }] of refsToSync) {
          if (
            key === refSyncKeyName ||
            !mapCameraRef?.current ||
            !mapRef?.current
          ) {
            continue
          }

          mapCameraRef.current.setCamera({
            centerCoordinate: center,
            zoomLevel: zoom,
            animationDuration: 0,
          })
        }
      },
    []
  )

  return { onCameraChanged, syncMapRefs }
}
