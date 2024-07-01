/* const template = document.createElement('template');
template.innerHTML = `
` */
import * as $COW from '../shared/cow_reference.js'
import * as $DOM from '../../../utility/domFunctions.js';


export class UnitSelect extends HTMLElement {
  constructor() {
    super();
    const $Doctrine = "Axis";
    // Create a shadow root, append to Shadow DOM
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const _ = {
      portraits: './custom/cow/shared/images/units/portraits/',
      svg: './custom/cow/shared/images/icons/icons.svg',
      doctrine: './custom/cow/shared/images/icons/doctrines/'
    }

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="./custom/cow/shared/cow.css">

      <div class="container unit-select">

        <div data-type="doctrine-select"></div>

        <div class="container select-panel">
          <div class="icon-bar category" data-type='categories'></div>
          <div class="icon-bar units" data-type='units'></div>
        </div>
      </div>

      <div id="unitInfo">
        <slot></slot>
      </div>`

    // Setup Categories
    const _Categories = Object.getOwnPropertyNames($COW.UNIT_TYPES);

    _Categories.forEach(c => {
      const thisSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      thisSvg.innerHTML = `<use href="${_.svg}#category-${c.toLowerCase()}"></use>`;

      const thisA = document.createElement('a');
      thisA.dataset.category = c;
      thisA.title = c;
      thisA.href = '#';
      thisA.innerHTML = `${thisSvg.outerHTML}<span>${c}</span>`;

      this.shadowRoot.querySelector("[data-type='categories']").appendChild(thisA);

      const _IconSet = document.createElement('div')
      _IconSet.dataset.iconset = c.toLowerCase();
      _IconSet.classList.add("icon-set")

      //Add Units to Icon Set - default is Axis
      $COW.UNIT_TYPES[c].forEach(u => {
        //check if Image exists
        const thisImg = document.createElement('img');
        const missingImg = `${_.portraits}unknown.png`
        const _imgUrl = `${_.portraits}axis/${$DOM.removeSpaces(u.toLowerCase())}.png`;

        $DOM.imageExists(_imgUrl).then(exists => {
          if (exists) { thisImg.src = _imgUrl }
          else { thisImg.src = missingImg }
        }).catch((error) => {
          console.debug('Image not found', error);
        });


        let unitA = document.createElement('a')
        unitA.dataset.unittype = u;
        unitA.href = '#';
        unitA.title = u;
        unitA.classList.add($DOM.removeSpaces(c.toLowerCase()));

        let unitSpan = document.createElement('span');
        unitSpan.textContent = u;
        unitA.appendChild(thisImg);
        unitA.appendChild(unitSpan);
        _IconSet.appendChild(unitA);
      })
      this.shadowRoot.querySelector("[data-type='units']").appendChild(_IconSet);
    });

    $COW.DOCTRINES.forEach(d => {
      const image = document.createElement('img');
      image.src = `${_.doctrine}${d.toLowerCase()}.png`;
      const link = document.createElement('a');
      if (d === "Axis") { link.classList.add("active") }
      link.href = '#';
      link.dataset.doctrine = d;
      link.appendChild(image);
      const div = this.shadowRoot.querySelector("[data-type='doctrine-select']");
      div.appendChild(link);
    })





    this.setupEventListeners();

  }//end of connectedCallback();

  setupEventListeners() {
    const parentMenuItems = this.shadowRoot.querySelectorAll('.icon-bar.category a');
    const subMenus = this.shadowRoot.querySelectorAll('.icon-bar.units .icon-set');
    const subMenuItems = this.shadowRoot.querySelectorAll('.icon-bar.units a');
    const doctrines = this.shadowRoot.querySelectorAll("[data-doctrine]");

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

        const unitValue = item.getAttribute('data-unittype');
        //Change unit portrait image on info bar
        document.querySelector('[data-imageType="unitIcon"]').src = item.children[0].src;
        // Dispatch a custom event with the unit value
        this.dispatchEvent(new CustomEvent('unitSelected', {
          detail: { unitValue },
          bubbles: true,
          composed: true
        }));
      });
    });

    doctrines.forEach(item => {
      item.addEventListener('click', (event) => {
        event.preventDefault();

        doctrines.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const doctrineValue = item.getAttribute('data-doctrine');
        let unitValue;
        if (this.shadowRoot.querySelector('[data-unittype].active')) {
         unitValue = this.shadowRoot.querySelector('[data-unittype].active').getAttribute('data-unittype') || null;
          
        };

        console.log("Unit Value: ", unitValue)

        this.dispatchEvent(new CustomEvent('doctrineSelected', {
          detail: { doctrineValue },
          data: doctrines,
          bubbles: true,
          composed: true
        }));

        if (unitValue != null) {
          this.dispatchEvent(new CustomEvent('unitSelected', {
            detail: { unitValue },
            bubbles: true,
            composed: true

          }));
        }
      })
    })

    this.addEventListener('doctrineSelected', this.updateDoctrine.bind(this));

  }//end of setupEventListeners ----------------------------------

  updateDoctrine(event) {

    const portraits = './custom/cow/shared/images/units/portraits/';
    const missingImg = `${portraits}unknown.png`;
    const { doctrineValue } = event.detail;
    this.$Doctrine = doctrineValue;


    this.shadowRoot.querySelectorAll('[data-unittype]').forEach($U => {
      const unitType = $DOM.removeSpaces($U.getAttribute("data-unittype")).toLowerCase();
      const _imgUrl = `${portraits}${doctrineValue.toLowerCase()}/${unitType}.png`;
      const thisImg = $U.children[0];

      $DOM.imageExists(_imgUrl).then(exists => {
        if (exists) { thisImg.src = _imgUrl }
        else { thisImg.src = missingImg }
      }).catch((error) => {
        console.debug('Image not found', error);
      });

    })
    //console.log(this.shadowRoot.querySelector(".icon-bar.units"))
    this.shadowRoot.querySelector(".icon-bar.units").dataset.currentDoctrine = doctrineValue;




  };//end of updateDoctrine --------------------------------------------


};//end of UnitSelect Element ===========================================
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
    if (type !== "overview" && type !== "combat" && type !== "costs" && type !== "research") {
      throw new Error("Invalid Stats Table type - should be overview, combat, costs or research");
    }
    let config = this.setConfig(type);

    //const headers = this.dataset.headers.split(',').map(header => header.trim());
    const headers = config.headers.split(",").map(header => header.trim());
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="./custom/cow/shared/cow.css">

    <div class="container-tables">
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
    </div>`
    this.shadowRoot.querySelector('span#title').textContent = config.title;
    const tableBody = this.shadowRoot.querySelector('tbody');

    config.sourceList.forEach(item => {
      const row = document.createElement('tr');
      const headCell = document.createElement('td');
      headCell.classList.add('rowLabel');
      headCell.appendChild(document.createElement('img')).src = `${config.iconPath}${config.prefix}${item.toLowerCase()}.png`;
      headCell.appendChild(document.createElement('span')).innerText = item;
      row.appendChild(headCell);

      for (let i = 1; i <= headers.length - 1; i++) {
        const cell = document.createElement('td')
        cell.setAttribute("data-cellID",
          headers[i] === "" ? `${item}` : `${headers[i]}-${item}`.trim());
        row.appendChild(cell);
      }
      tableBody.append(row);
    })

  }

  disconnectedCallback() { }

  static get observedAttributes() { return []; }
  attributeChangedCallback(atr, oldValue, newValue) { }

  setConfig(type) {

    const config = {
      title: "",
      headers: "",
      prefix: "",
      iconPath: "",
      sourceList: ""
    }
    switch (type) {
      case "overview":
        config.title = "Unit Overview";
        config.headers = ",";
        config.prefix = '';
        config.iconPath = './custom/cow/shared/images/labels/';
        config.sourceList = $COW.BASICS;
        break;
      case 'combat':
        config.title = "Combat Statistics";
        config.headers = ",Attack,Defense"
        config.prefix = 'class_',
          config.iconPath = './custom/cow/shared/images/labels/'
        config.sourceList = $COW.CLASSES
        break;
      case 'costs':
        config.title = "Costs";
        config.headers = ",Production,Upkeep"
        config.prefix = ''
        config.iconPath = './custom/cow/shared/images/resources/'
        config.sourceList = $COW.RESOURCES
        break;
      case 'research':
        config.title = "Research";
        config.headers = ",Research,Upgrade";
        config.prefix = '';
        config.iconPath = './custom/cow/shared/images/resources/';
        config.sourceList = $COW.RESOURCES;
    }
    return config
  }

  set value(newValue) {
    this.shadowRoot.querySelector(`td[data-cellID="${newValue.target}"]`).textContent = newValue.value
  }
};
customElements.define("cow-statstable", StatsTable);

