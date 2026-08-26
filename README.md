# Native-UI-Kit

A collection of framework-free, reusable, vanilla Web Components built with the native Custom Elements API.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2026.1.0.0-green.svg)](#)

Perfect for developers like me who prefer to build things themselves without React, Svelte, or other UI frameworks.

This site is not owned by me, but I agree with the message as it correlates to the purpose of this repository.

https://justfuckingusehtml.com/

## Components

Native-UI-Kit provides small, reusable components that can be dropped directly into existing HTML applications without requiring a framework, build system, or additional dependencies.

Current components include:

- `v-input` - A special `<input>` element with built-in value sanitization and validation helpers.
- `i-switch` - A customizable switch/toggle component.
- `password-toggle` - A control for toggling password input visibility.
- `context-menu` - A customizable right-click context menu.
- `toast-notif` - A toast notification component with configurable positioning, offsets, delays, and persistence.

More components will be added over time.

## Documentation & Examples

Documentation for each component can be found in the [docs folder](https://github.com/SharkPool-SP/native-ui-kit/tree/main/docs).

For code examples, see the [tests folder](https://github.com/SharkPool-SP/native-ui-kit/tree/main/tests).

## Installation & Usage

Native-UI-Kit components are framework-free and can be included directly with standard `<script>` tags.

For example:

```html
<script src="./v-input.js"></script>
<script src="./i-switch.js"></script>
<script src="./password-toggle.js"></script>
<script src="./context-menu.js"></script>
<script src="./toast-notif.js"></script>
```

## Contribution

You can contribute your own custom reusable component by forking the repository, adding your code to a new branch, and submitting a pull request.

We're happy to review and potentially add your creations!
