/* const template = document.createElement('template');
template.innerHTML = `
` */
import * as COW_LIST from '../shared/cow_reference.js'

export class UnitSelect extends HTMLElement {
    constructor() {
      super();
      const imagePath='./custom/cow/shared/images/units'
      // Create a shadow root, append to Shadow DOM
      this.attachShadow({ mode: "open" });
    }
    connectedCallback(){
      const svgPath = './custom/cow/shared/images/icons/unitCategories/iconDefinitions.svg';
      this.shadowRoot.innerHTML=`
      <link rel="stylesheet" href="./custom/cow/shared/cow.css">
      <div class="container">
      <div class="icon-bar category" data-type='categories'>

      <a  data-category="Infantry" href="#">
        <svg class="i"><use href="${svgPath}#category-infantry"/></svg>
        <span>Infantry</span>
      </a>

      <a data-category="Tanks" href="#">
        <svg class="i"><use href="${svgPath}#category-tanks"/></svg>
        <span>Tanks</span>
      </a>

      <a data-category="Ordnance" href="#" >
        <svg class="i"><use href="${svgPath}#category-ordnance"/></svg>
        <span>Ordnance</span>
      </a>

      <a data-category="Air" href="#">
        <svg class="i"><use href="${svgPath}#category-air"/></svg>
        <span>Air</span>
      </a>

      <a data-category="Naval" href="#">
        <svg class="i"><use href="${svgPath}#category-naval"/></svg>
        <span>Naval</span>
      </a>
      <a data-category="Secret" href="#" >
        <svg class="i"><use href="${svgPath}#category-secret"/></svg>
        <span>Secret</span>
      </a>

  </div>

  <div class="icon-bar units" data-type='units'>
        <div class="icon-set" data-iconset="infantry">
          <a href="#" data-unittype="militia">
            <img src="./custom/cow/shared/images/units/portraits/militia_1.png">
            <span>Militia</span>
          </a>
          <a href="#" data-unittype="infantry">
            <img src="./custom/cow/shared/images/units/portraits/infantry_1.png">
            <span>Infantry</span>
          </a>
          <a href="#" data-unittype="motorizedinfantry">
            <img src="./custom/cow/shared/images/units/portraits/motorizedinfantry_1.png">
            <span>Motorized Infantry</span>
          </a>
          <a href="#" data-unittype="mechanizedinfantry">
            <img src="./custom/cow/shared/images/units/portraits/mechanizedinfantry_1.png">
            <span>Mechanized Infantry</span>
          </a>
          <a href="#" data-unittype="commando">
            <img src="./custom/cow/shared/images/units/portraits/commando_1.png">
            <span>Commando</span>
          </a>
          <a href="#" data-unittype="paratrooper">
            <img src="./custom/cow/shared/images/units/portraits/paratrooper_1.png">
            <span>Paratrooper</span>
          </a>
      </div>
       <div class="icon-set" data-iconset="tanks">
          <a  href="#">Armoured Car</a>
          <a  href="#">Light Tank</a>
          <a  href="#">Medium Tank</a>
          <a  href="#">Heavy Tank</a>
          <a  href="#">Tank Destroyer</a>
    </div>
           <div class="icon-set" data-iconset="ordnance">
          <a  href="#">Anti-Tank Gun</a>
          <a  href="#">Artillery</a>
          <a  href="#">Anti-Air Gun</a>
          <a  href="#">SP Artillery</a>
          <a  href="#">SP Anti-Air</a>
    </div>
           <div class="icon-set" data-iconset="air">
          <a  href="#">Interceptor</a>
          <a  href="#">Tactical Bomber</a>
          <a  href="#">Attack Bomber</a>
          <a  href="#">Strategic Bomber</a>
          <a  href="#">Naval Bomber</a>
    </div>
           <div class="icon-set" data-iconset="naval">
          <a  href="#">Destroyer</a>
          <a  href="#">Submarine</a>
          <a  href="#">Cruiser</a>
          <a  href="#">Battleship</a>
          <a  href="#">Aircraft Carrier</a>
          <a  href="#">Troop Transport</a>
    </div>
           <div class="icon-set" data-iconset="secret">
          <a  href="#">Rocket Artillery</a>
          <a  href="#">SP Rocket Artillery</a>
          <a  href="#">Rocket Fighter</a>
          <a  href="#">Flying Bomb/Rocket</a>
          <a  href="#">Nuclear Bomber </a>
          <a  href="#">Nuclear Rocket</a>
    </div>
  </div>
  </div>
  <div id=unitInfo>
  <slot></slot>
  </div>`
  this.setupEventListeners();
  //end of connectedCallback();
  }
  setupEventListeners() {
    const parentMenuItems = this.shadowRoot.querySelectorAll('.icon-bar.category a');
    const subMenus = this.shadowRoot.querySelectorAll('.icon-bar.units .icon-set');
    const subMenuItems = this.shadowRoot.querySelectorAll('.icon-bar.units a');

    parentMenuItems.forEach(item => {
      item.addEventListener('click', (event) => {
        event.preventDefault();

        // Remove active class from all parent menu items
        parentMenuItems.forEach(i => i.classList.remove('active'));

        // Add active class to the clicked item
        item.classList.add('active');

        // Get the category from the clicked item
        const category = item.getAttribute('data-category').toLowerCase();

        // Hide all sub-menus
        subMenus.forEach(subMenu => {
          subMenu.style.display = 'none';
        });

        // Show the sub-menu corresponding to the clicked category
        const activeSubMenu = this.shadowRoot.querySelector(`.icon-set[data-iconset="${category}"]`);
        if (activeSubMenu) {
          activeSubMenu.style.display = 'flex';
        }
      });
    });

    subMenuItems.forEach(item => {
      item.addEventListener('click', (event) => {
        event.preventDefault();

        subMenuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Set the unit value
        const unitValue = item.textContent.trim();

        // Dispatch a custom event with the unit value
        this.dispatchEvent(new CustomEvent('unitSelected', {
          detail: { unitValue },
          bubbles: true,
          composed: true
        }));
      });
    });
  }
};

customElements.define("cow-unitselector", UnitSelect);



//=====================================================================================================//
/**
 * Custom Element - Stats Table
 */
export class StatsTable extends HTMLElement {
  constructor() {
    super();
    // Create a shadow root, append to Shadow DOM
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
/* const node = document.importNode(template.content, true);
    this.shadowRoot.appendChild(node); */
    let type = (this.getAttribute('data-type'));
    if (type !== "overview" && type !== "combat" && type !== "costs"){
      throw new Error("Invalid Stats Table type - should be overview, combat or costs");
    }
    let config = this.setConfig(type);   
    
    //const headers = this.dataset.headers.split(',').map(header => header.trim());
    const headers = config.headers.split(",").map(header => header.trim());
    this.shadowRoot.innerHTML = `
    <style>
      .container { 
        min-width: 300px;
        min-height: 300px;
        height: 100%;
        border: solid 1px #1D1B12;
        border-radius: 5px;
      }

      table { width: 90%; font-size: 0.8em; margin: 10px;  }

      td:not(:first-child) { text-align: center; }

      .rowLabel { display: flex; flex-direction: row; align-items: center; margin: 0.3em 0; }

      .rowLabel img { height: 20px; margin-right: 3px; }

      .heading { 
        padding: 5px 2px;
        background-image: linear-gradient(to right, #1D1B12, #595444);
        font-size: small;
        color: white;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600; 
      }
    </style>

    <div class="container">
      <div class = "heading">
        <span id = "title"></span>
      </div>
    
      <table>
      <thead>
        <tr>
          ${headers.map(header => `<th>${header}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
    <slot></slot>
    </div`
    this.shadowRoot.querySelector('span#title').textContent = config.title;
    const tableBody = this.shadowRoot.querySelector('tbody');
    config.sourceList.forEach(item => {
      const row = document.createElement('tr');
      const headCell = document.createElement('td');
        headCell.classList.add('rowLabel');
        headCell.appendChild(document.createElement('img')).src =`${config.iconPath}${config.prefix}${item.toLowerCase()}.png`;
        headCell.appendChild(document.createElement('span')).innerText = item;
      row.appendChild(headCell);

      for (let i = 1;i <= headers.length-1; i++){
        const cell = document.createElement('td')
        cell.setAttribute("data-cellID",
          headers[i] === "" ? `${item}`: `${headers[i]}-${item}`.trim());
        row.appendChild(cell);
      }       
  tableBody.append(row);  
  })

  }

  disconnectedCallback() { }

  static get observedAttributes() { return []; }
  attributeChangedCallback(atr, oldValue, newValue) { }
  
  setConfig(type){

    const config = {
      title:"",
      headers:"",
      prefix:"",
      iconPath:"",
      sourceList:""
    }
    switch (type){
      case "overview" :
        config.title="Unit Overview";
        config.headers=",";
        config.prefix='';
        config.iconPath='./custom/cow/shared/images/labels/';
        config.sourceList = COW_LIST.BASICS;
      break;
      case 'combat':
        config.title="Combat Statistics";
        config.headers=",Attack,Defense"
        config.prefix='class_',
        config.iconPath = './custom/cow/shared/images/labels/'
        config.sourceList=COW_LIST.CLASSES
        break;
      case 'costs':
        config.title="Costs";
        config.headers=",Production,Upkeep"
        config.prefix = ''
        config.iconPath='./custom/cow/shared/images/resources/'
        config.sourceList=COW_LIST.RESOURCES
        break;
    }
    return config
    }
    


  set value(newValue){
    this.shadowRoot.querySelector(`td[data-cellID="${newValue.target}"]`).textContent = newValue.value
  }
};
customElements.define("cow-statstable", StatsTable);
