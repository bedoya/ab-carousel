# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Slider transition direction when the `prev` button is clicked

## [0.1.0] - 2024-10-30

### Added
- **Button class**: Introduced a `Button` class for encapsulating button behavior.
- **EventEmitter**: Added to manage custom events within the carousel.
- **Dynamic button initialization**: Implemented to simplify button assignment and functionality.
- **Button actions**: Integrated actions for `prev`, `next`, and `stop` with distinct event emissions.

### Changed
- **`initControls` method**: Refactored for streamlined button initialization and event handling.
- **HTML structure**: Updated example buttons to utilize class-based identification.

### Fixed
- Improved handling of button clicks to trigger appropriate events.
- Fixed slide transition issues for better visibility during animations.

## [0.0.7] - 2024-10-29

### Added
- **applyEffects method**: Added to handle applying effects per slide.
- **transition_plugin**: Set up to manage transitions, moved out of `animateSlider` for optimization.
- **ABFade, ABSlide, ABKenBurns plugins**: Initial transition and effect plugins for customizable slides.

### Fixed
- Switched to object `class ABCarousel` instead of `function ABCarousel`
- Slide display issue causing all slides to show simultaneously during transition.
- Duplicate interval initialization, moved to the constructor.

### Removed
- **`applyImageEffects` method**: The function is no longer needed, as `applyEffects` takes care of the functionality.
---

## [0.0.1] - 2024-10-29

### Added
- Initial release of `ab-carousel` with core functionality.
- Basic transitions (`fade`, `slide`) and effects (`Ken Burns`) support.
- Example HTML structure and basic initialization in the README.
