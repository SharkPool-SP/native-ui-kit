/**
 * 'toast-notif' displays a 'Toast Notification' on a specified edge of the user's screen.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class Toast extends HTMLElement {
  static ACTIVE_NOTIFS = 0;
  static LOC_BOTTOM = "bottom";
  static LOC_BOTTOM_LEFT = "bottom-left";
  static LOC_BOTTOM_RIGHT = "bottom-right";
  static LOC_TOP = "top";
  static LOC_TOP_LEFT = "top-left";
  static LOC_TOP_RIGHT = "top-right";
  static TOAST_STYLES;

  static {
    // Initialize the styles for all toast displays
    Toast.TOAST_STYLES = document.createElement("style");
    Toast.TOAST_STYLES.classList.add("toast-notifs");
    Toast.TOAST_STYLES.innerHTML = `
      body {
        --toast-notif-anim-speed: 350ms;
        --toast-notif-active: 0;
      }
      toast-notif {
        pointer-events: none;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
      }
      toast-notif .notif-wrapper {
        cursor: pointer;
        pointer-events: initial;
        opacity: 1;
        width: max-content;
        height: auto;
        position: relative;
        transform: translate(-50%, -50%);
        transition:
          left var(--toast-notif-anim-speed) ease-in-out,
          bottom var(--toast-notif-anim-speed) ease-in-out,
          top var(--toast-notif-anim-speed) ease-in-out,
          transform var(--toast-notif-anim-speed) ease-in-out,
          opacity var(--toast-notif-anim-speed) ease-in-out
      }
      toast-notif .notif-wrapper[closing] {
        opacity: 0;
        transform: translate(-50%, -25%);
      }
    `.trim();

    document.head.appendChild(Toast.TOAST_STYLES);
  }

  /**
   * Parses a toast's 'from' (location) attribute to a valid location.
   * See Toast.LOC_*.
   *
   * @param {String} value The user-defined location attribute
   * @returns Valid location name
   */
  static parseLocation(value) {
    value = String(value).trim().toLowerCase();
    switch (value) {
      case Toast.LOC_TOP:
        return Toast.LOC_TOP;
      case Toast.LOC_TOP_LEFT:
        return Toast.LOC_TOP_LEFT;
      case Toast.LOC_TOP_RIGHT:
        return Toast.LOC_TOP_RIGHT;
      case Toast.LOC_BOTTOM:
        return Toast.LOC_BOTTOM;
      case Toast.LOC_BOTTOM_LEFT:
        return Toast.LOC_BOTTOM_LEFT;
      case Toast.LOC_BOTTOM_RIGHT:
      default:
        return Toast.LOC_BOTTOM_RIGHT;
    }
  }

  /**
   * Converts a offset value to a CSS value with the unit attached.
   * If one already exists, it will use that, otherwise pixels.
   *
   * @param {Number} value Offset value
   * @returns CSS value as the specified unit or in pixels
   */
  static offsetToUnit(value) {
    if (/^-?\d+(?:\.\d+)?$/.test(value)) return value + "px";
    else return value;
  }

  /**
   * Updates the activate notifications CSS variable.
   */
  static updateActiveNotifCount() {
    document.body.style.setProperty(
      "--toast-notif-active",
      Toast.ACTIVE_NOTIFS,
    );
  }

  static get observedAttributes() {
    return ["from", "x-offset", "y-offset"];
  }

  constructor() {
    super();

    this._wrapper = null;
    this._bounds = null;
    this._closeHandler = null;
    this._fromLoc = null;
    this._delay = null;
    this._deletionDelay = null;
    this._isPersistent = null;
    this._offsetX = null;
    this._offsetY = null;
  }

  connectedCallback() {
    const delay = Number(this.getAttribute("delay"));
    const deletionDelay = Number(this.getAttribute("delete-after"));

    // Put all child elements in a wrapper we can animate as one.
    this._wrapper = document.createElement("div");
    this._wrapper.classList.add("notif-wrapper");
    this._wrapper.append(...Array.from(this.children));
    this.append(this._wrapper);

    this._isPersistent = this.hasAttribute("persistent");
    this._fromLoc = Toast.parseLocation(this.getAttribute("from"));
    this._delay = Number.isFinite(delay) ? Math.max(0, delay) : 0;
    if (this.hasAttribute("delete-after")) {
      this._deletionDelay = Number.isFinite(deletionDelay)
        ? Math.max(0, deletionDelay)
        : 0;
    }
    this._offsetX = this._getXOffset();
    this._offsetY = this._getYOffset();

    if (!this._isPersistent) {
      this._closeHandler = this._animateOutAndDelete.bind(this);
      this.addEventListener("click", this._closeHandler);
    }

    this._init();
    if (this._delay) {
      setTimeout(() => {
        this._setVisiblePosition();

        if (this._deletionDelay) {
          setTimeout(this._animateOutAndDelete.bind(this), this._deletionDelay);
        }
      }, this._delay);
    } else {
      this._setVisiblePosition();
    }
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._closeHandler);

    Toast.ACTIVE_NOTIFS--;
    Toast.updateActiveNotifCount();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this._wrapper) return;

    switch (name) {
      case "from":
        this._fromLoc = Toast.parseLocation(newValue);
        this._offsetX = this._getXOffset();
        this._setVisiblePosition();
        break;
      case "x-offset":
        this._offsetX = this._getXOffset();
        this._setVisiblePosition();
        break;
      case "y-offset":
        this._offsetY = this._getYOffset();
        this._setVisiblePosition();
        break;
    }
  }

  /**
   * Gets the specified x-offset based on the respective attribute.
   * Otherwise 0 or 15px depending on the location.
   *
   * @private
   * @returns X offset as a CSS unit
   */
  _getXOffset() {
    if (this.hasAttribute("x-offset")) {
      return Toast.offsetToUnit(this.getAttribute("x-offset"));
    }

    return Toast.offsetToUnit(
      this._fromLoc === Toast.LOC_TOP || this._fromLoc === Toast.LOC_BOTTOM
        ? 0
        : 15,
    );
  }

  /**
   * Gets the specified y-offset based on the respective attribute. Otherwise 15px.
   *
   * @private
   * @returns Y offset as a CSS unit
   */
  _getYOffset() {
    if (this.hasAttribute("y-offset")) {
      return Toast.offsetToUnit(this.getAttribute("y-offset"));
    }

    return Toast.offsetToUnit(15);
  }

  /**
   * Set the toast's position into the viewport using the specified
   * animation type (this._fromLoc).
   *
   * @private
   */
  _setVisiblePosition() {
    if (!this._wrapper || !this._bounds) return;

    const bounds = this._bounds;

    this._wrapper.style.top = "";
    this._wrapper.style.bottom = "";
    this._wrapper.style.left = "";

    const from = this._fromLoc;

    const isTop =
      from === Toast.LOC_TOP ||
      from === Toast.LOC_TOP_LEFT ||
      from === Toast.LOC_TOP_RIGHT;

    const isLeft =
      from === Toast.LOC_TOP_LEFT || from === Toast.LOC_BOTTOM_LEFT;

    const isRight =
      from === Toast.LOC_TOP_RIGHT || from === Toast.LOC_BOTTOM_RIGHT;

    // Vertical position
    if (isTop) {
      this._wrapper.style.top = `calc(${bounds.height / 2}px + ${
        this._offsetY
      })`;
    } else {
      this._wrapper.style.bottom = `calc(-100% + ${bounds.height / 2}px + ${
        this._offsetY
      })`;
    }

    // Horizontal position
    if (isLeft) {
      this._wrapper.style.left = `calc(${bounds.width / 2}px + ${
        this._offsetX
      })`;
    } else if (isRight) {
      this._wrapper.style.left = `calc(100% - ${bounds.width / 2}px - ${
        this._offsetX
      })`;
    } else {
      this._wrapper.style.left =
        this._offsetX === "0px" ? "50%" : `calc(50% + ${this._offsetX})`;
    }
  }

  /**
   * Initializes the toast wrapper's position.
   *
   * @private
   */
  _init() {
    this._bounds = this._wrapper.getBoundingClientRect();
    Toast.ACTIVE_NOTIFS++;
    Toast.updateActiveNotifCount();

    const bounds = this._bounds;
    const from = this._fromLoc;

    const isTop =
      from === Toast.LOC_TOP ||
      from === Toast.LOC_TOP_LEFT ||
      from === Toast.LOC_TOP_RIGHT;

    const isLeft =
      from === Toast.LOC_TOP_LEFT || from === Toast.LOC_BOTTOM_LEFT;

    const isRight =
      from === Toast.LOC_TOP_RIGHT || from === Toast.LOC_BOTTOM_RIGHT;

    // Vertical starting position
    if (isTop) {
      this._wrapper.style.top = `calc(${bounds.height / 2}px + ${
        this._offsetY
      })`;
    } else {
      this._wrapper.style.bottom = `calc(-100% + ${bounds.height / 2}px)`;
    }

    // Horizontal starting position
    if (isLeft) {
      this._wrapper.style.left = `calc(${-bounds.width}px - ${this._offsetX})`;
    } else if (isRight) {
      this._wrapper.style.left = `calc(100% + ${bounds.width / 2}px + ${
        this._offsetX
      })`;
    } else {
      this._wrapper.style.left =
        this._offsetX === "0px" ? "50%" : `calc(50% + ${this._offsetX})`;
    }
  }

  /**
   * Animate the toast closing (out of view) and remove it from the DOM.
   *
   * @private
   */
  _animateOutAndDelete() {
    this._wrapper.setAttribute("closing", "");
    this._wrapper.addEventListener(
      "transitionend",
      () => {
        this.remove();
      },
      { once: true },
    );
  }
}

customElements.define("toast-notif", Toast);
