// Renderer JavaScript
import { MyCustomElement } from "./components/simplegreeting/simplegreeting.js";
import { SigninModal } from "./components/signin-modal/signin-modal.js";
import { SignupModal } from "./components/signup-modal/signup-modal.js";
// import { UserProfile } from "./components/user-profile/user-profile.js";

const script = document.createElement("script");
script.src = "https://accounts.google.com/gsi/client";
script.async = true;
document.head.appendChild(script);

customElements.define("simple-greeting", MyCustomElement);
customElements.define("signin-modal", SigninModal);
customElements.define("signup-modal", SignupModal);
// customElements.define("user-profile", UserProfile);
