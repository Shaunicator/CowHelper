const template = document.createElement('template');
template.innerHTML = `
<style>
  #value { font-weight: 500; }
  #label-icon { height: 20px; margin-right: 3px; }
  .label-container, .row{
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0.3em 0;
  }
  .row{ 
    width: 100%;
    justify-content: space-between;
  }
  .label-container{ width: 50%; }

</style>

<div class=row>
    <div class="label-container">
        <img id="label-icon"> 
        <span id="label-text"></span>
    </div>
    <div class="valueContainer">
        <span id="value">0</span>
    </div>
</div>
`
class StatRow extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root, append to Shadow DOM
    this.attachShadow({ mode: "open" });
    //this.shadow.appendChild(template.content.cloneNode(true));

  }

  static get observedAttributes() { return []; }
  get value() {
  }
  set value(newValue) {
    this.shadowRoot.querySelector('#value').innerText = newValue;
  };

  connectedCallback() {
    const node = document.importNode(template.content, true);
    this.shadowRoot.appendChild(node);
    this.shadowRoot.getElementById('label-icon').src = `../custom/cow/shared/images/labels/${this.getAttribute('stat').toLowerCase().replace(/\s/g, '')}.png`;
    this.shadowRoot.getElementById('label-text').innerText = this.getAttribute('stat');
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }


  attributeChangedCallback(atr, oldValue, newValue) {
    // called when one of attributes listed above is modified
    //this first one is an example, will aim to make it more dynamic

    //If I pass an object to update everything, I should use a loop
  }

  // there can be other element methods and properties
}
// let the browser know that <my-element> is served by our new class
customElements.define("cow-statrow", StatRow);