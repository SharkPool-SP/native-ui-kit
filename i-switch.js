/**
 * 'i-switch' is a custom toggle switch element (essentially a fancy checkbox).
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class iSwitch extends HTMLElement {
  static SWITCH_MARGIN = 5;
  static SWITCH_STYLES;

  static {
    // Initialize the styles for all switches
    iSwitch.SWITCH_STYLES = document.createElement("style");
    iSwitch.SWITCH_STYLES.classList.add("i-switches");
    iSwitch.SWITCH_STYLES.innerHTML = `
body {
  --i-switch-outer: #00a9f5;
  --i-switch-knob: #fff;
}

i-switch {
  display: flex;
  border-radius: 100px;
  width: 100px;
  height: 40px;
  overflow: hidden;
  background: var(--i-switch-outer);
  transition: filter 200ms ease-in-out;
  cursor: pointer;
}
i-switch[value="false"] {
  filter: grayscale(1);
}
i-switch .switch-inner {
  position: relative;
  border-radius: 100px;
  background: var(--i-switch-knob);
  transition: transform 200ms ease-in-out;
}
    `.trim();

    document.head.appendChild(iSwitch.SWITCH_STYLES);
  }

  constructor() {
    super();

    this._handleClick = null;
    this._switch = null;
    this._value = false;

    // Recalculate knob size whenever the host element is resized
    this._resizeObserver = new ResizeObserver(() => {
      this._initSwitchSize();
      this._updateSwitch();
    });

    // Define value as a property with getter/setter to keep state in sync
    Object.defineProperty(this, "value", {
      get() {
        // Cast to boolean to prevent injection via attribute manipulation
        return this._value ? true : false;
      },
      set(value) {
        this._value = value;
        this._updateSwitch();
      },
      enumerable: true,
      configurable: false,
    });
  }

  connectedCallback() {
    this._handleClick = (event) => {
      this.value = !this.getValue();
      event.stopPropagation();

      this.dispatchEvent(
        new Event("input", {
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
    };

    this._render();
    this.addEventListener("click", this._handleClick);
    this._resizeObserver.observe(this);

    // Read initial value from attribute (accepts "true", "1", or anything else as false)
    this.value =
      this.getAttribute("value") === "true" ||
      this.getAttribute("value") === "1";

    if (!this.getValue()) {
      this.setAttribute("value", "false");
    }
  }

  disconnectedCallback() {
    this._resizeObserver.disconnect();
    this.removeEventListener("click", this._handleClick);
  }

  /**
   * Renders the switch and inner knob.
   *
   * @private
   */
  _render() {
    this.innerHTML = `<div class="switch-inner"></div>`;
    this._switch = this.querySelector(".switch-inner");
    this._initSwitchSize();
  }

  /**
   * Initializes the size of the inner switch (knob) based on the parent node height.
   *
   * @private
   */
  _initSwitchSize() {
    if (!this._switch) return;

    const height = this.getBoundingClientRect().height;
    this._switch._sizeRatio = height - iSwitch.SWITCH_MARGIN * 2;
    this._switch.style.width = this._switch._sizeRatio + "px";
    this._switch.style.height = this._switch._sizeRatio + "px";
    this._switch.style.margin = iSwitch.SWITCH_MARGIN + "px";
  }

  /**
   * Update the knob position based on the value.
   *
   * @private
   */
  _updateSwitch() {
    this.setAttribute("value", this.getValue());
    if (this.getValue()) {
      const hostWidth = this.getBoundingClientRect().width;
      const knobSize = this._switch._sizeRatio + iSwitch.SWITCH_MARGIN * 2;
      this._switch.style.transform = `translateX(${hostWidth - knobSize}px)`;
    } else {
      this._switch.style.transform = `translateX(0px)`;
    }
  }

  /**
   * Get the switch value.
   *
   * @returns true if the switch is on
   */
  getValue() {
    return this.value;
  }
}

customElements.define("i-switch", iSwitch);
