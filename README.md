# ExampleApps

These are example apps implementations for various sdks mostly related to react-native, react, ios and android platforms.

## Apps

| App Name      | Tutorials                                                                               |
| ------------- | --------------------------------------------------------------------------------------- |
| @rnmapbox/map | multi-map-layering slide interaction [link](./apps/mapbox/mapbox-multi-map-layering.md) |

## Setup

Please copy the `.local-examples.config.js` and create a `.local-examples.config.js` on the top of the repo root directory. This will be used to configure local secrets if applicable.

To see all the commands per app run the server for nx
`nx show project <app>` E.g `nx show project mapbox`

```zsh
cp .local-example.config.js .local.config.js
```

Typical commands `nx run <app-name>:start` eg `nx run mapbox:start`

## @nx/expo installation

To add a dependency.

- The app must be an `@nx/expo` built app or library.
- run `nx run <app>:install <dep-name>`
  - e.g. `nx run mapbox:install @rnmapbox/maps` would install `@rnmapbox/maps` to `apps/mapbox`.

## Examples

Each app contains a list of examples. Some apps require specific setup. Please make sure to follow their guides.

- [rnmapbox](https://github.com/rnmapbox/maps)
  - Requirements:
    - Complete this setup by creating a mapbox download token and adding it to mapbox/.local.config.js
  - SlideMap
