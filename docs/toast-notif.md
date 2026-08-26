# Toast Notification `toast-notif`

The `toast-notif` element displays a temporary notification along an edge of the user's screen.

Toast notifications can be positioned at the top, bottom, or either corner of the viewport. They can also be configured to remain visible until manually removed.

## Installation

To install `toast-notif`, include the component source file in your web app using a `<script>` element:

```html
<script src="path/to/toast-notif.js"></script>
```

Once loaded, you can use `<toast-notif>` anywhere in your project.

## Usage

Add a `toast-notif` element containing the content you want to display:

```html
<toast-notif>
  <p>Hello, world!</p>
</toast-notif>
```

The notification will animate into view from the bottom-right corner by default.

By default, clicking the notification closes it.

## Attributes

### `from`

The `from` attribute specifies which edge or corner of the viewport the notification should appear from.

Supported values are:

- `top` - top-center of the viewport.
- `top-left` - top-left corner.
- `top-right` - top-right corner.
- `bottom` - bottom-center of the viewport.
- `bottom-left` - bottom-left corner.
- `bottom-right` - bottom-right corner. This is the default.

```html
<toast-notif from="top">
  <p>Notification from the top</p>
</toast-notif>
```

```html
<toast-notif from="bottom-left">
  <p>Notification from the bottom-left</p>
</toast-notif>
```

If an invalid location is provided, `bottom-right` is used.

### `delay`

The `delay` attribute specifies how long to wait before the notification moves into its visible position.

The value is specified in milliseconds.

```html
<toast-notif delay="1000">
  <p>This notification appears after one second.</p>
</toast-notif>
```

Negative values are treated as `0`.

### `delete-after`

The optional `delete-after` attribute specifies how long to wait before the notification closes.

If not provied, the notification can only be closed if clicked (_that is, if you arent using the `persistent` attribute_)

The value is specified in milliseconds.

```html
<toast-notif delete-after="2000">
  <p>This notification disappears after two seconds.</p>
</toast-notif>
```

Negative values are treated as `0`.

### `persistent`

The `persistent` attribute prevents the notification from automatically closing when clicked.

```html
<toast-notif persistent>
  <p>This notification stays open until removed.</p>
</toast-notif>
```

Without `persistent`, clicking the notification starts its closing animation and removes it from the DOM.

### `x-offset`

The `x-offset` attribute controls the horizontal distance between the notification and its default position.

Numeric values are interpreted as pixels.

```html
<toast-notif x-offset="25">
  <p>Offset by 25 pixels.</p>
</toast-notif>
```

CSS units can also be specified:

```html
<toast-notif x-offset="2rem">
  <p>Offset by 2rem.</p>
</toast-notif>
```

For top-center and bottom-center notifications, the default horizontal offset is `0px`.

For corner notifications, the default horizontal offset is `15px`.

### `y-offset`

The `y-offset` attribute controls the vertical distance between the notification and its default position.

Numeric values are interpreted as pixels.

```html
<toast-notif y-offset="30">
  <p>Offset by 30 pixels.</p>
</toast-notif>
```

CSS units can also be specified:

```html
<toast-notif y-offset="2rem">
  <p>Offset by 2rem.</p>
</toast-notif>
```

The default vertical offset is `15px`.

## Methods

`toast-notif` does not expose any public instance methods.

## Events

`toast-notif` does not dispatch any custom events.

When a non-persistent notification is clicked, it automatically starts its closing animation and removes itself from the DOM after the animation completes.

## Custom CSS

`toast-notif` provides basic positioning and animation styles, but the notification's contents can be styled freely.

### CSS Variables

The component exposes the following CSS variables:

| Variable                   | Description                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| `--toast-notif-anim-speed` | Controls the duration of the toast's position and closing animations. |
| `--toast-notif-active`     | Contains the number of currently active toast notifications.          |

The default animation speed is `350ms`.

```css
body {
  --toast-notif-anim-speed: 500ms;
}
```

The active notification count can also be used to customize styles based on how many notifications are currently displayed:

```css
body {
  --toast-notif-active: 0;
}
```

## Static Properties

The `Toast` class exposes constants for the supported notification locations:

```js
Toast.LOC_TOP;
Toast.LOC_TOP_LEFT;
Toast.LOC_TOP_RIGHT;
Toast.LOC_BOTTOM;
Toast.LOC_BOTTOM_LEFT;
Toast.LOC_BOTTOM_RIGHT;
```

The class also exposes `Toast.ACTIVE_NOTIFS`, which tracks the number of currently active notifications.
