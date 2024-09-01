import React, { FC, useMemo, useState } from 'react'
import { useWindowDimensions, Text, StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

import { SyncedMap } from './SyncedMap'
import { useMapSync } from './useMapSync'
import { dynamicStyle } from './GeoJsonStyles'
import {
  defaultCenter,
  defaultZoomLevel,
  maxZoomLevel,
  minZoomLevel,
} from './mapConfig'
import { SlideIndicatorLayer } from './SlideIndicatorLayer'
import { SlideMode } from './types'
import { TouchableHighlight } from 'react-native-gesture-handler'

const styles = StyleSheet.create({
  mapOverlayContainer: {
    top: 0,
    bottom: 0,
    position: 'absolute',
    right: 0, // Forces map to always be bound to right side of container
    overflow: 'hidden', // hides the mapOverlay that bleeds out of this View
  },
  mapUnderlay: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    right: 0, // Forces map to always be bound to right side of container
  },
})

const getNextSlideMode = (input: SlideMode): SlideMode => {
  if (input === SlideMode.All) return SlideMode.Horizontal
  return SlideMode.All
}

export const SlideMap: FC = () => {
  const { width, height } = useWindowDimensions()
  const mapSyncProps = useMapSync()
  const [slideMode, setSlideMode] = useState<SlideMode>(SlideMode.Horizontal)

  const slideButtonPressed = useSharedValue<boolean>(false)
  const sharedMapClipXValue = useSharedValue<number>(width * 0.5)
  const sharedMapClipYValue = useSharedValue<number>(height)

  const mapCameraProps = useMemo(
    () => ({
      animationDuration: 0,
      centerCoordinate: defaultCenter,
      maxZoomLevel,
      minZoomLevel,
      zoomLevel: defaultZoomLevel,
    }),
    []
  )

  const slidingMapClipAnimationStyle = useAnimatedStyle(
    () => ({
      bottom: interpolate(
        sharedMapClipYValue.value,
        [0, height / 2, height],
        [height, height / 2, 0],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        }
      ),
      left: interpolate(
        sharedMapClipXValue.value,
        [0, width / 2, width],
        [width - 50, width / 2, 50],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        }
      ),
    }),
    [sharedMapClipXValue.value]
  )

  const nextSlideMode = useMemo(() => getNextSlideMode(slideMode), [slideMode])

  const slideModeToggle = useMemo(() => {
    return (
      <View
        style={{
          position: 'absolute',
          zIndex: 9999,
          padding: 6,
        }}
      >
        <TouchableHighlight
          style={{
            backgroundColor: 'black',
            borderColor: 'white',
            borderWidth: 4,
            padding: 6,
            minWidth: 100,
            borderRadius: 5,
          }}
          onPress={() => setSlideMode(nextSlideMode)}
        >
          <Text style={{ fontSize: 18, color: 'white' }}>
            Mode: {slideMode}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }, [nextSlideMode, slideMode])

  return (
    <View style={{ width, height }}>
      {slideModeToggle}
      <View collapsable={false} style={{ ...StyleSheet.absoluteFillObject }}>
        <SyncedMap
          mapStyle={[styles.mapUnderlay, { width, height }]}
          mapProps={{
            styleJSON: dynamicStyle({
              landCover: {
                fillColor: 'rgba(255,255,20,0.5)',
              },
              hillshade: {
                fillColor: 'orange',
              },
            }),
          }}
          cameraProps={mapCameraProps}
          {...mapSyncProps}
          refSyncKeyName='leftMap'
        />
      </View>
      <Animated.View
        collapsable={false}
        style={[styles.mapOverlayContainer, slidingMapClipAnimationStyle]}
      >
        <SyncedMap
          mapProps={{
            styleJSON: dynamicStyle(),
          }}
          mapStyle={styles.mapOverlay}
          cameraProps={mapCameraProps}
          {...mapSyncProps}
          refSyncKeyName='rightMap'
        />
      </Animated.View>
      <SlideIndicatorLayer
        slideMode={slideMode}
        sharedPressValue={slideButtonPressed}
        sharedMapClipXValue={sharedMapClipXValue}
        sharedMapClipYValue={sharedMapClipYValue}
      />
    </View>
  )
}
