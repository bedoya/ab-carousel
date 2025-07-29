# Changelog

## [1.1.0] - 2025-07-29

### Added

- `ABPluginDotMarkers` plugin with clickable dots and active slide sync.

### Changed

- Improved test structure: separated into `public-api`, `instantiation`, and `behavior` directories.
- Refactored internal slide activation logic for better testability.

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
