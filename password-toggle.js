/**
 * 'password-toggle' creates an interface that toggles the text of a nearby password input element.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class PasswordToggle extends HTMLElement {
  static LAYOUT_CHECKBOX = "checkbox";
  static LAYOUT_BUTTON = "button";
  static IMG_SHOW =
    "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcvPjxnIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxnIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxMmMtMS43NDcgMy41NzYtNi4xMjMgNy0xMCA3LTMuODc4IDAtOC4yNTQtMy40MjQtMTAtN20yMCAwYy0xLjc0Ny0zLjU3Ni02LjEyMi03LTEwLTctMy44NzcgMC04LjI1NCAzLjQyMy0xMCA3Ii8+PHBhdGggZD0iTTE1IDEyYTMgMyAwIDEgMS02IDAgMyAzIDAgMCAxIDYgMCIvPjwvZz48L3N2Zz4=";
  static IMG_HIDE =
    "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0ibTQgNCA1Ljg3OSA1Ljg3OU0yMCAyMGwtNS44NzktNS44NzlNOS44OCA5Ljg4YTMgMyAwIDEgMCA0LjI0MyA0LjI0M005Ljg3OCA5Ljg3OGw0LjI0MiA0LjI0Mk02Ljc2OCA2Ljc2OEM0LjcyOCA4LjEgMi45NjQgMTAuMDI2IDIgMTJjMS43NDYgMy41NzYgNi4xMjIgNyAxMCA3IDEuNzM4IDAgMy41NzUtLjY4OCA1LjIzMi0xLjc2OE05Ljc2MiA1LjM0N0E3LjkgNy45IDAgMCAxIDEyIDVjMy44NzcgMCA4LjI1MiAzLjQyNCA5Ljk5OSA3LS41NTIgMS4xMy0xLjM2NiAyLjI0NS0yLjM0NSAzLjI0MSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==";
  static TOGGLER_STYLES;

  static {
    // Initialize the styles for all togglers
    PasswordToggle.TOGGLER_STYLES = document.createElement("style");
    PasswordToggle.TOGGLER_STYLES.classList.add("password-togglers");
    PasswordToggle.TOGGLER_STYLES.innerHTML = `
  password-toggle[layout="${PasswordToggle.LAYOUT_CHECKBOX}"] {
    text-transform: capitalize;
  }
  password-toggle[layout="${PasswordToggle.LAYOUT_BUTTON}"] {
    display: inline-block;

    button {
      border-radius: 0;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    img {
      width: 80%;
      height: 80%;
    }
  }
      `.trim();

    document.head.appendChild(PasswordToggle.TOGGLER_STYLES);
  }

  constructor() {
    super();

    this._handleClick = null;
    this._handleChange = null;
    this._layout = null;
    this._input = null;
    this._isPassword = null;
  }

  connectedCallback() {
    const layout = this.getAttribute("layout") || PasswordToggle.LAYOUT_BUTTON;
    const optTargetId =
      this.getAttribute("target-id") || this.getAttribute("target");

    this._layout = layout;
    this._input = this._searchForInput(optTargetId);

    this._render();
    this._setupListeners();
    this.setAttribute("layout", this._layout);

    if (!this._input) {
      console.error("Password Toggle: Input search error", this);
      throw new Error("No input element found!");
    }

    this._isPassword = this._input.type === "password";
    this._updateLayoutGUI();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("change", this._handleChange);
  }

  /**
   * Renders the toggler.
   *
   * @private
   */
  _render() {
    switch (this._layout) {
      case PasswordToggle.LAYOUT_CHECKBOX: {
        this.innerHTML = `<label><input type="checkbox"/><span>show password</span></label>`;
        break;
      }
      case PasswordToggle.LAYOUT_BUTTON:
      default: {
        this.innerHTML = `<button><img draggable="false" src alt></button>`;
      }
    }
  }

  /**
   * Setup listeners for this element.
   *
   * @private
   */
  _setupListeners() {
    switch (this._layout) {
      case PasswordToggle.LAYOUT_CHECKBOX: {
        const checkbox = this.querySelector('input[type="checkbox"]');
        this._handleChange = () => {
          this.setViewable(checkbox.checked);
        };

        checkbox.addEventListener("change", this._handleChange);
        break;
      }
      case PasswordToggle.LAYOUT_BUTTON:
      default: {
        this._handleClick = (event) => {
          this.toggleViewable();
          event.stopPropagation();
        };

        this.addEventListener("click", this._handleClick);
      }
    }
  }

  /**
   * Initializes the password input to toggle.
   * Will first check `opt_targetId` if provided, otherwise will query select.
   *
   * @param {String} [opt_targetId] Optional element id used to target a input element
   * @returns input element if found, otherwise null
   */
  _searchForInput(opt_targetId) {
    if (opt_targetId) {
      const target = document.getElementById(opt_targetId);
      const targetName = target.nodeName;

      if (targetName === "INPUT") return target;
      if (targetName === "V-INPUT") return target.input;
      return null;
    }

    const nearest = this.parentNode.querySelector(
      `v-input, input[type="password"], input[type="text"]`,
    );

    if (nearest.nodeName === "V-INPUT") return nearest.input;
    else return nearest;
  }

  /**
   * Updates the toggle display.
   *
   * @private
   */
  _updateLayoutGUI() {
    switch (this._layout) {
      case PasswordToggle.LAYOUT_CHECKBOX: {
        const checkbox = this.querySelector("input");
        checkbox.checked = !this._isPassword;
        break;
      }
      case PasswordToggle.LAYOUT_BUTTON:
      default: {
        const img = this.querySelector("img");
        img.alt = this._isPassword ? "Show password" : "Hide password";
        img.src = this._isPassword
          ? PasswordToggle.IMG_HIDE
          : PasswordToggle.IMG_SHOW;
      }
    }
  }

  /**
   * Sets whether the password is viewable or not.
   * @param {Boolean} viewable True if the password should be viewable
   * @param {String} [opt_viewableType] Optional input type to use for visible passwords
   */
  setViewable(viewable, opt_viewableType) {
    this._input.type = viewable ? (opt_viewableType ?? "text") : "password";
    this._isPassword = !viewable;
    this._updateLayoutGUI();
  }

  /**
   * Toggles whether the password is viewable or not.
   */
  toggleViewable() {
    this.setViewable(this._isPassword);
  }
}

customElements.define("password-toggle", PasswordToggle);
