/**
 * Renderer script to initialize and define custom elements.
 * Handles registration of custom elements with the browser.
 */
import { MyCustomElement } from "./components/simplegreeting/simplegreeting.js";
import { SigninModal } from "./components/signin-modal/signin-modal.js";
import { SignupModal } from "./components/signup-modal/signup-modal.js";

/**
 * Registers the `simple-greeting` custom element.
 * Represents a reusable test UI component.
 * @see MyCustomElement
 */
customElements.define("simple-greeting", MyCustomElement);

/**
 * Registers the `signin-modal` custom element.
 * Represents a modal dialog for user sign-in functionality.
 * @see SigninModal
 */
customElements.define("signin-modal", SigninModal);

/**
 * Registers the `signup-modal` custom element.
 * Represents a modal dialog for user sign-up functionality.
 * @see SignupModal
 */
customElements.define("signup-modal", SignupModal);
