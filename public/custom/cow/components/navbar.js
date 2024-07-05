export class NavBar extends HTMLElement {
    constructor() {
      super();
      const pageTitle = ""
      //const imagePath='./custom/cow/shared/images/units'
      // Create a shadow root, append to Shadow DOM
      this.attachShadow({ mode: "open" });
    }
    connectedCallback(){
this.shadowRoot.innerHTML=`
<link rel="stylesheet" href="./custom/cow/shared/cow.css">

<nav>
<a class="mainTitle" href="index.html">

    <h1> Call of War Helper </h1>
    <span class="version">v0.3.2</span>
</a>

<h2 id='pageTitle'></h2>

<div class="links">
    <a href="./unit-info.html">Unit Info</a>
    <a href="./tips-and-tricks.html">Tips and Tricks</a>
</div>

</nav>
`
    }
    setPageTitle(title){
        this.shadowRoot.querySelector('#pageTitle').textContent = title;
    }
}customElements.define("cow-navbar", NavBar)