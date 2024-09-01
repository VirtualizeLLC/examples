/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useMemo, useState } from 'react'
import {
  SafeAreaView,
  Text,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native'
import { SlideMap } from '../SlideMap/SlideMap'
import { setAccessToken } from '@rnmapbox/maps'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export enum Examples {
  SlideMap = 'Slide Map',
}

if (process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY) {
  setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_KEY)
} else {
  console.error(
    '!!! No mapbox key setup !!!!.\n Please generate a public mapbox api key and place within .env of apps/mapbox IE apps/mapbox/.env. \nMake sure you are running a development build too, expo go is not supported by mapbox gl'
  )
}

export const App = () => {
  const [selectedExample, setSelectedExample] = useState<Examples>(
    Examples.SlideMap
  )

  const selectedExampleComponent = useMemo(() => {
    switch (selectedExample) {
      case Examples.SlideMap:
        return <SlideMap />
      default:
        return <Text>Error Invalid Example</Text>
    }
  }, [selectedExample])

  return (
    <GestureHandlerRootView>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView
        style={{
          flex: 1,
          position: 'relative',
        }}
      >
        <View
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
            position: 'relative',
          }}
        >
          <TouchableOpacity
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              width: 50,
              height: 50,
            }}
          >
            <Text style={{ color: 'white' }}>Go back</Text>
          </TouchableOpacity>
        </View>
        {selectedExampleComponent}
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default App
