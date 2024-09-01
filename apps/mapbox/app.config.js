// eslint-disable-next-line @nx/enforce-module-boundaries
const localConfig = require('../../.local.config.js')

const expoConfig = {
  expo: {
    name: 'AppsMapbox',
    slug: 'mapbox',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    scheme: 'example',
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'dev.vllc.rnmapboxexample',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'dev.vllc.rnmapboxexample',
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsVersion: '11.4.0',
          /**
           * @WARNING this will add your key to gradle.properties and Podfile.
           * - Use .netrc and a local.properties to avoid this exposure for public repos
           */
          // RNMapboxMapsDownloadToken:
          //   localConfig.mapbox.RNMapboxMapsDownloadToken,
        },
      ],
    ],
  },
}

module.exports = expoConfig
