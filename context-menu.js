/**
 * 'context-menu' creates a custom right-click menu on a specified element or document body.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class ContextMenu extends HTMLElement {
  static CURRENT_MENU = null;
  static MENU_STYLES;

  static {
    // Initialize the styles for all context menus
    ContextMenu.MENU_STYLES = document.createElement("style");
    ContextMenu.MENU_STYLES.classList.add("context-menus");
    ContextMenu.MENU_STYLES.innerHTML = `
      body {
        --context-menu-min-width: 150px;
      }
      context-menu {
        display: none;
        position: absolute;
        min-width: var(--context-menu-min-width);
      }
      context-menu[active] {
        display: block;
      }
      context-menu * {
        display: block;
        width: 100%;
        text-align: left;
      }
    `.trim();

    document.head.appendChild(ContextMenu.MENU_STYLES);
  }

  constructor() {
    super();

    this._menuTarget = null;
    this._multipleSelections = null;

    this._handleUnfocus = this._handleUnfocus.bind(this);
    this._handleOptionSelect = this._handleOptionSelect.bind(this);
    this._handleOpenMenu = this._handleOpenMenu.bind(this);
  }

  connectedCallback() {
    const optTargetId =
      this.getAttribute("target-id") || this.getAttribute("target");

    this._multipleSelections = this.hasAttribute("multiple");
    this._menuTarget = optTargetId
      ? document.getElementById(optTargetId)
      : this.parentNode.nodeName === "BODY"
        ? window
        : this.parentNode;

    if (!this._menuTarget) {
      console.error("Context Menu: DOM search error", this);
      throw new Error("No target element found!");
    }

    this.addEventListener("click", this._handleOptionSelect);
    this._menuTarget.addEventListener("contextmenu", this._handleOpenMenu);
  }

  disconnectedCallback() {
    this._removeUnfocusListener();

    if (this._menuTarget) {
      this._menuTarget.removeEventListener("contextmenu", this._handleOpenMenu);
    }

    if (ContextMenu.CURRENT_MENU === this) {
      ContextMenu.CURRENT_MENU = null;
    }
  }

  /**
   * Determines whether this menu is the closest context menu
   * associated with the event target.
   *
   * @private
   * @param {MouseEvent} event
   * @returns {Boolean}
   */
  _isClosestMenu(event) {
    const target = event.target;
    if (!target) return this._menuTarget instanceof Window;

    // Walk up from the event target until we reach this menu's target.
    // If another context-menu target is found first, this menu should not show.
    let element = target;
    while (element && element !== this._menuTarget) {
      const menu = element.querySelector(":scope > context-menu");
      if (menu) return menu._menuTarget instanceof Window;

      element = element.parentElement;
    }

    if (!element) {
      if (this._menuTarget instanceof Window) return true;
    }

    return element === this._menuTarget;
  }

  /**
   * Sets up the handler that fires when the context menu is unfocused.
   *
   * @private
   */
  _setupUnfocusListener() {
    window.addEventListener("click", this._handleUnfocus);
  }

  /**
   * Removes the unfocused context menu handler.
   *
   * @private
   */
  _removeUnfocusListener() {
    window.removeEventListener("click", this._handleUnfocus);
  }

  /**
   * Handles clicks outside this menu.
   *
   * @private
   * @param {MouseEvent} event
   */
  _handleUnfocus(event) {
    if (!this.contains(event.target)) {
      this._handleCloseMenu();
    }
  }

  /**
   * Handle when the user selects an option in the context menu.
   *
   * @private
   */
  _handleOptionSelect(event) {
    if (!this._multipleSelections) {
      this._handleCloseMenu();
    }

    if (!event.target || event.target === this) return;

    this.dispatchEvent(
      new CustomEvent("select", {
        bubbles: true,
        composed: true,
        detail: {
          selection: event.target,
        },
      }),
    );
  }

  /**
   * Closes this context menu.
   *
   * @private
   */
  _handleCloseMenu() {
    this.removeAttribute("active");
    this._removeUnfocusListener();

    if (ContextMenu.CURRENT_MENU === this) {
      ContextMenu.CURRENT_MENU = null;
    }
  }

  /**
   * Handle when the user opens a context menu on an element.
   *
   * @private
   * @param {MouseEvent} event Context menu event
   */
  _handleOpenMenu(event) {
    // If this isn't the closest menu for the event target,
    // let the more deeply nested menu handle it.
    if (!this._isClosestMenu(event)) return;

    event.preventDefault();

    if (ContextMenu.CURRENT_MENU && ContextMenu.CURRENT_MENU !== this) {
      ContextMenu.CURRENT_MENU._handleCloseMenu();
    }

    this.style.top = event.clientY + "px";
    this.style.left = event.clientX + "px";
    this.setAttribute("active", "");

    ContextMenu.CURRENT_MENU = this;
    this._removeUnfocusListener();
    this._setupUnfocusListener();
  }
}

customElements.define("context-menu", ContextMenu);
