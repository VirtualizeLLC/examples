import merge from 'deepmerge'

export const createSimpleColoredLayer = (color = '#FFF7EF') => ({
  id: 'background',
  type: 'background',
  layout: {},
  paint: {
    'background-color': color,
  },
})

export const purpleBlueRGBA = 'rgba(94, 99, 255, 0.7)'

interface StyleColor {
  fillColor: string
  fillOutlineColor: string
  lineColor: string
}

interface DynamicStyleConfig {
  landCover?: Partial<StyleColor>
  hillshade?: Partial<StyleColor>
  contour?: Partial<StyleColor>
}

const dynamicStyleDefault: DynamicStyleConfig = {
  landCover: {
    fillColor: 'rgba(66,100,251,1)',
    fillOutlineColor: 'rgba(66,0,251,1)',
  },
  hillshade: {
    fillColor: 'rgba(66,100,251,1)',
    fillOutlineColor: 'rgba(0,255,251,1)',
  },
  contour: {
    lineColor: '#ffffff',
  },
}

export const dynamicStyle = (config: DynamicStyleConfig = {}) => {
  const { landCover, hillshade, contour } = merge(dynamicStyleDefault, config)
  return JSON.stringify({
    version: 8,
    name: 'Mapbox Terrain tileset v2',
    sources: {
      'mapbox-terrain': {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2',
      },
    },
    layers: [
      {
        id: 'landcover',
        source: 'mapbox-terrain',
        'source-layer': 'landcover',
        type: 'fill',
        paint: {
          'fill-color': landCover.fillColor,
          'fill-outline-color': landCover.fillOutlineColor,
        },
      },
      {
        id: 'hillshade',
        source: 'mapbox-terrain',
        'source-layer': 'hillshade',
        type: 'fill',
        paint: {
          'hillshade-exaggeration': 20,
          'fill-color': hillshade.fillColor,
          'fill-outline-color': hillshade.fillOutlineColor,
        },
      },
      {
        id: 'contour',
        source: 'mapbox-terrain',
        'source-layer': 'contour',
        type: 'line',
        paint: {
          'line-color': contour.lineColor,
        },
      },
    ],
  })
}
