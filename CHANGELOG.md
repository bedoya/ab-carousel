# Changelog

## [1.1.0] - 2025-07-29

### Added

- `ABPluginDotMarkers` plugin with clickable dots and active slide sync.
- `contained` property to `ABCarouselPlugin` to control whether a plugin renders inside `.ab-carousel-plugins` container or directly in the main carousel container.
- New plugin type `'navigation'` in `PluginType` union (in `ABExtensionsTypes.ts`) to support navigation-related plugins like arrows.
- New `ABPluginNavigationArrows` plugin with navigation arrows.
- Default registration of `ABPluginNavigationArrows` in `registry.ts`.
- Styles for navigation arrows in `ab-plugin-arrows.css`.
- Updated `example4-plugins.html` to demonstrate navigation arrows.

### Changed

- Improved test structure: separated into `public-api`, `instantiation`, and `behavior` directories.
- Refactored internal slide activation logic for better testability.
- `getPluginContainer()` now checks the `contained` flag to determine the appropriate container for rendering plugins.

### Tests

- 99.15% overall coverage with full coverage in plugins and effects.

## [1.0.0] - 2025-07-26

### Added

- Core `ABCarousel` class with plugin system.
- Built-in `playback` plugin (autoplay with pause/resume).
- Transition system with `ABCarouselTransition`, including `slide` and `fade` transitions.
- Effects system with `ABCarouselEffect`, including `kenburns`, `pulsating-glow`, and `bounce-in` effects.
- Overlay support with click-to-expand images.
- Visibility detection to auto-pause playback.
- Full test coverage using Vitest.
- ESM + CJS builds and TypeScript declarations.
