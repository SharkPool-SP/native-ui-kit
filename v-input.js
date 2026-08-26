/**
 * 'v-input' wraps a standard input element with value sanitization and casting.
 *
 * Supports the following input types:
 * text, email, password, number, range.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class VInput extends HTMLElement {
  static get VALID_EMAIL_REGEX() {
    // Standard HTML5 email validation regex
    // Reference: stackoverflow.com/questions/62415313/how-to-make-html5-email-validation-regex-work-in-c
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  }

  constructor() {
    super();

    this._input = null;
    this._value = "";
  }

  connectedCallback() {
    this.innerHTML = `<input/>`;
    this._input = this.querySelector("input");

    // Pass all attributes from the custom element down to the native input
    for (let i = 0; i < this.attributes.length; i++) {
      const attr = this.attributes.item(i);
      this._input.setAttribute(attr.name, attr.value);
    }
  }

  get input() {
    return this._input;
  }

  /**
   * Sets the value of the input directly.
   *
   * @param {*} value Value to set
   */
  setValue(value) {
    this._input.value = value;
  }

  /**
   * Gets the validated and casted value of the input.
   * Returns opt_fallbackValue (or null) if the value fails validation.
   *
   * @param {*} opt_fallbackValue Fallback value if input is invalid
   * @returns {String|Number|null} Cast and validated input value
   */
  getValue(opt_fallbackValue) {
    const type = this._input.type;
    let value = this._input.value;

    const isRequired = this.hasAttribute("required");
    const shouldTrim = this.hasAttribute("trim");
    const min = this.getAttribute("min") ?? this.getAttribute("minlength");
    const max = this.getAttribute("max") ?? this.getAttribute("maxlength");
    const pattern = this.getAttribute("pattern");

    switch (type) {
      case "number":
      case "range": {
        value = Number(value);
        if (isNaN(value)) value = 0;
        if (max !== null) value = Math.min(Number(max), value);
        if (min !== null) value = Math.max(Number(min), value);
        break;
      }
      case "email":
      case "password":
      case "text": {
        value = String(value);
        if (shouldTrim) value = value.trim();
        if (min !== null && value.length < Number(min)) {
          return opt_fallbackValue ?? null;
        }
        if (max !== null) {
          value = value.substring(0, Number(max));
        }
        if (isRequired && value.length === 0) return opt_fallbackValue ?? null;
        if (pattern) {
          const regex = new RegExp(`^${pattern}$`);
          if (!regex.test(value)) return opt_fallbackValue ?? null;
        }
        break;
      }
      default:
        console.warn("Casting input into unsupported type!", this);
        return value;
    }

    if (type === "email" && !VInput.VALID_EMAIL_REGEX.test(value)) {
      return opt_fallbackValue ?? null;
    }

    return value;
  }
}

if (globalThis.customElements) {
  globalThis.customElements.define("v-input", VInput);
}
