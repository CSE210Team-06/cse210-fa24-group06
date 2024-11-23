// Create a class for the element
class MyCustomElement extends HTMLElement {
  static observedAttributes = ["color", "size"];

  constructor() {
    super(); // Call the superclass constructor
    this.attachShadow({ mode: "open" }); // Attach a shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        p {
          font-size: 40px;
          color: blue;
          background-color: red;
        }
      </style>
      <p>Hello, World!</p>
    `;
  }

  connectedCallback() {
    console.log("Custom element added to page.");
  }

  // disconnectedCallback() {
  //   console.log("Custom element removed from page.");
  // }

  // adoptedCallback() {
  //   console.log("Custom element moved to new page.");
  // }

  // attributeChangedCallback(name, oldValue, newValue) {
  //   console.log(`Attribute ${name} has changed.`);
  // }
}

customElements.define("simple-greeting", MyCustomElement);
