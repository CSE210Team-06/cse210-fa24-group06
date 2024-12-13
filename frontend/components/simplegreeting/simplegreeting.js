// Create a class for the element
export class MyCustomElement extends HTMLElement {
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
}
