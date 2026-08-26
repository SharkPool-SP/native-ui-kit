# V-Input `v-input`

The `v-input` element wraps a standard HTML `<input>` element and provides automatic value sanitization, validation, and type casting.

It supports the following input types:

- `text`
- `email`
- `password`
- `number`
- `range`

## Installation

To install `v-input`, include the component source file in your web app using a `<script>` element:

```html
<script src="path/to/v-input.js"></script>
```

Once loaded, you can use `<v-input>` anywhere in your project.

## Usage

Add a `v-input` element to your HTML:

```html
<v-input type="text"></v-input>
```

The component automatically creates a native `<input>` element and passes all attributes from `<v-input>` to it.

For example:

```html
<v-input type="number" min="0" max="100"></v-input>
```

is equivalent to creating:

```html
<input type="number" min="0" max="100" />
```

## Supported Input Types

`v-input` supports the following input types:

- `text` - Returns a string value
- `password` - Returns a string value
- `email` - Returns a validated email address
- `number` - Returns a numeric value
- `range` - Returns a numeric value

Other input types are not explicitly supported for value casting and will generate a warning when `getValue()` is called.

## Attributes

Because attributes are passed directly to the underlying `<input>`, standard HTML input attributes such as `required`, `min`, `max`, `minlength`, `maxlength`, and `pattern` can be used.

However, some attributes have different functionality within `<v-input>`.

### `required`

Requires the input to contain a value.

If the input is empty, `getValue()` returns the fallback value or `null`.

```html
<v-input type="text" required></v-input>
```

### `trim`

Automatically removes whitespace from the beginning and end of text values.

```html
<v-input type="text" trim></v-input>
```

For example, an input containing `"  hello  "` will return `"hello"`.

### `min` / `minlength`

For numeric inputs, `min` sets the minimum allowed value.

For text-based inputs, `min` sets the minimum required string length (`minlength` works too).

```html
<v-input type="number" min="0"></v-input>
<v-input type="text" min="3"></v-input>
```

If a text value is shorter than the specified minimum length, `getValue()` returns the fallback value or `null`.

### `max` / `maxlength`

For numeric inputs, `max` sets the maximum allowed value.

For text-based inputs, `max` limits the returned string to the specified length (`maxlength` works too).

```html
<v-input type="number" max="100"></v-input>
<v-input type="text" max="20"></v-input>
```

### `pattern`

Validates text values against a regular expression pattern.

```html
<v-input type="text" pattern="[A-Za-z]+"></v-input>
```

The pattern is automatically wrapped with `^` and `$`, so the entire value must match.

If the value does not match the pattern, `getValue()` returns the fallback value or `null`.

## Methods

### `input`

Returns the underlying native `<input>` element.

```js
const input = vInput.input;
```

This can be useful when you need direct access to the native input element.

### `setValue(value)`

Sets the value of the underlying input directly.

```js
vInput.setValue("Hello");
```

The value is assigned directly and is not validated or casted.

### `getValue(opt_fallbackValue)`

Returns the input's validated and casted value.

The optional `opt_fallbackValue` argument is returned when validation fails. If no fallback is provided, `null` is returned.

```js
const value = vInput.getValue();
```

With a fallback value:

```js
const value = vInput.getValue("default");
```

Email inputs are additionally validated using the component's built-in email validation.

## Events

`v-input` does not dispatch any custom events.

The underlying native `<input>` element and its events can still be accessed through the `<v-input>` if you need to add event listeners:

```js
vInput.addEventListener("input", (event) => {
  console.log(event.target.value);
});
```

## Custom CSS

`v-input` does not provide any custom CSS of its own. Since it wraps a standard `<input>` element, you can style the component or its underlying input using regular CSS.

```css
v-input input {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
```

## Example

A complete example using validation and type casting:

```html
<v-input type="number" min="1" max="100" required></v-input>

<script>
  const input = document.querySelector("v-input");

  input.setValue("42");

  const value = input.getValue();

  console.log(value); // 42
  console.log(typeof value); // "number"
</script>
```
