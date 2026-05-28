# input-helper changelog

## 1.1.0 - 2026-05-28

### Added

- New `suppressNative` option for `handleInput` (defaults to `true`)
- New `suppressNative` option for `clearElementForTouch` (defaults to `true`)
- iOS touch behavior demo page at `extras/demo-scroll-context.html`
- `handleInput` behavior comparison demo page at `extras/demo-handleinput-suppress-native.html`

### Changed

- iOS `clickAndContextHelper` now preserves native scrolling while still supporting tap and long-press context callbacks
- Improved iOS device detection for modern iPadOS user-agent behavior
- Corrected touch force event listener from `ontouchforcechange` to `touchforcechange`
- Updated README examples to document native suppression options

### Fixed

- ESLint setup now includes required `@eslint/css` dependency
- Flat config now scopes JS-only rules and ignores metadata/build files to avoid lint parser errors

## 1.0.1 - 2025-02-12

### Added

- Backwards compatibility for older implementations

## 1.0.0 - 2025-01-08

_initial release_