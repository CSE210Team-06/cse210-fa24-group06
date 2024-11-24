// Renderer JavaScript
import { MyCustomElement } from "./components/simplegreeting/simplegreeting.js";
import { SigninModal } from "./components/signin-modal/signin-modal.js";
const script = document.createElement("script");
script.src = "https://accounts.google.com/gsi/client";
script.async = true;
document.head.appendChild(script);

customElements.define("simple-greeting", MyCustomElement);
customElements.define("signin-modal", SigninModal);
