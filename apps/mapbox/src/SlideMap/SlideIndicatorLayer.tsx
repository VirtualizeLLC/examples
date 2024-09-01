import { FC, useMemo } from 'react'
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { IndicatorValues, SlideMode } from './types'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Svg, { Polygon } from 'react-native-svg'

const styles = StyleSheet.create({
  buttonView: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderColor: 'rgba(50,50,50, 1)',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
  pressable: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragArea: {
    position: 'absolute',
    zIndex: 9999,
    elevation: 9999,
    height: '100%',
    width: 50,
  },
  buttonInset: {
    position: 'relative',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderRadius: 50,
  },
})

const ArrowIndicator = ({
  size = 25,
  style,
}: {
  size: number
  style: ViewStyle
}) => (
  <Svg style={style} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    <Polygon
      points={`${size},${size} ${size / 2},0 0,${size}`}
      fill={'white'}
      stroke='black'
      strokeWidth={3}
    />
  </Svg>
)

export const SlideIndicatorLayer: FC<
  IndicatorValues & { slideMode: SlideMode }
> = ({
  sharedPressValue,
  sharedMapClipXValue,
  sharedMapClipYValue,
  slideMode,
}) => {
  const { width, height } = useWindowDimensions()
  const sliderButtonEvents = useMemo(
    () => ({
      onPressIn: () => {
        sharedPressValue.value = true
      },
      onPressOut: () => {
        sharedPressValue.value = false
      },
    }),
    [sharedPressValue]
  )

  const panGesture = Gesture.Pan()
    .onStart(() => {
      sharedPressValue.value = true
    })
    .onUpdate((event) => {
      sharedPressValue.value = true
      if (slideMode === SlideMode.All) {
        sharedMapClipYValue.value += event.y
      }
      sharedMapClipXValue.value -= event.x
    })
    .onEnd((event) => {
      sharedPressValue.value = false
      if (slideMode === SlideMode.All) {
        sharedMapClipYValue.value += event.y
      }
      sharedMapClipXValue.value -= event.x
    })

  const animatedDragArea = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: interpolate(
            sharedMapClipXValue.value,
            [0, width / 2, width],
            [width - 65, width / 2 - 15, 35],
            {
              extrapolateLeft: Extrapolation.CLAMP,
              extrapolateRight: Extrapolation.CLAMP,
            }
          ),
        },
      ],
    }),
    [sharedMapClipXValue.value]
  )

  const animatedButtonStyle = useAnimatedStyle(
    () => ({
      borderColor: sharedPressValue.value ? 'white' : 'rgba(0,0,0,0)',
    }),
    [sharedPressValue.value]
  )

  const mapBottomClipStyle = useAnimatedStyle(
    () => ({
      bottom:
        slideMode === SlideMode.All
          ? interpolate(
              sharedMapClipYValue.value,
              [0, height / 2, height],
              [height - 75, height / 2, 75],
              {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP,
              }
            )
          : height / 2,
    }),
    [sharedMapClipYValue.value, slideMode]
  )

  return (
    <Animated.View style={[styles.dragArea, animatedDragArea]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.buttonView, mapBottomClipStyle]}>
          <Pressable {...sliderButtonEvents} style={styles.pressable}>
            <Animated.View style={[styles.buttonInset, animatedButtonStyle]}>
              <View
                style={{ position: 'absolute', flexDirection: 'row', gap: 20 }}
              >
                <ArrowIndicator
                  size={25}
                  style={{ transform: [{ rotate: '-90deg' }] }}
                />
                {slideMode === SlideMode.All && (
                  <View
                    style={{
                      position: 'absolute',
                      flexDirection: 'row',
                      gap: 20,
                      transform: [{ rotate: '90deg' }],
                    }}
                  >
                    <ArrowIndicator
                      size={25}
                      style={{ transform: [{ rotate: '-90deg' }] }}
                    />
                    <ArrowIndicator
                      size={25}
                      style={{ transform: [{ rotate: '90deg' }] }}
                    />
                  </View>
                )}
                <ArrowIndicator
                  size={25}
                  style={{ transform: [{ rotate: '90deg' }] }}
                />
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}
