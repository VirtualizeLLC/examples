# mapbox

A demo app currently demonstrating multi-map layering approach discussed in the [mapbox-multi-map-layering guide]("./mapbox-multi-map-layering.md")

All code is free to use here under a MIT license.

## Setup

```bash
npm install
npx nx run mapbox:run-ios
npx nx start mapbox
```

It's possible `nx start mapbox` will be enough after npm install. But run-ios is recommended for re-installing fresh dependencies. `start mapbox` might not always rebuild everything.

Please verify by reviewing the nx docs on the expo plugin for this.

To speedup things install nx globally for your current version of nodeJs `npm i -g nx`
