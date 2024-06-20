//Don't use .innerText as it is non-standard. Use .textContent instead.

//search adopted style sheets / module scripts
const template = document.createElement('template');
template.innerHTML=`
`

class UnitInfoPanel extends HTMLElement {
    constructor() {
      super();
            
      // Create a shadow root, append to Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
      //this.attachShadow({mode: 'open'});
      //this.shadowRoot.appendChild(template.content.cloneNode(true));

    }
    static get observedAttributes(){
        return [];
    }
    get unitData(){

    }
    set unitData(data){

    }
  
    connectedCallback() {
      // browser calls this method when the element is added to the document
      // (can be called many times if an element is repeatedly added/removed)
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
customElements.define("cow-unitinfo", UnitInfoPanel);

  /* var dom = function(element, parent) {
    var api = { element: null };

    let querySel = function(selector, parent) {
        parent = parent || document;

        return parent.querySelector(selector);
    };
    let querySelAll = function(selector, parent) {
        parent = parent || document;

        return parent.querySelectorAll(selector);
    };

    switch(typeof element) {
        case 'string':
            parent = parent && typeof parent === 'string' ? querySel(parent) : parent;
            api.element = querySel(element, parent);
        break;
        case 'object': 
            if(typeof element.nodeName != 'undefined') {
                api.element = element;
            } else {
                let loop = function(value, object) {
                    object = object || this;
                    for(let property in object) {
                        if(typeof object[property].element != 'undefined') {
                            object[property] = object[property].val(value);
                        } else if(typeof object[property] == 'object') {
                            object[property] = loop(value, object[property]);
                        }
                    }
                    delete object.val;
                    return object;
                };
                let res = { val: loop };
                for(var key in element) {
                    res[key] = dom.apply(this, [element[key], parent]);
                }
                return res;
            }
            break;
    }
    api.val = function(value) {
        if(!this.element) return null;
        let set = !!value;
        let useValueProperty = function(value) {
            if(set) { this.element.value = value; return api; }
            else { return this.element.value; }
        };
        switch(this.el.nodeName.toLowerCase()) {
            case 'input':
                var type = this.el.getAttribute('type');
                if(type == 'radio' || type == 'checkbox') {
                    var els = qsa('[name="' + this.el.getAttribute('name') + '"]', parent);
                    var values = [];
                    for(var i=0; i<els.length; i++) {
                        if(set && els[i].checked && els[i].value !== value) {
                            els[i].removeAttribute('checked');
                        } else if(set && els[i].value === value) {
                            els[i].setAttribute('checked', 'checked');
                            els[i].checked = 'checked';
                        } else if(els[i].checked) {
                            values.push(els[i].value);
                        }
                    }
                    if(!set) { return type == 'radio' ? values[0] : values; }
                } else {
                    return useValueProperty.apply(this, [value]);
                }
                break;
            case 'textarea': 
                return useValueProperty.apply(this, [value]); 
            break;
            case 'select':
                if(set) {
                    var options = qsa('option', this.el);
                    for(var i=0; i<options.length; i++) {
                        if(options[i].getAttribute('value') === value) {
                            this.el.selectedIndex = i;
                        } else {
                            options[i].removeAttribute('selected');
                        }
                    }
                } else {
                    return this.el.value;
                }
                break;
            default: 
                if(set) {
                    this.el.innerHTML = value;
                } else {
                    if(typeof this.el.textContent != 'undefined') {
                        return this.el.textContent;
                    } else if(typeof this.el.innerText != 'undefined') {
                        return typeof this.el.innerText;
                    } else {
                        return this.el.innerHTML;
                    }
                }
            break;
        }
        return set ? api : null;
    };
    return api;
};

console.clear();
console.log(dom('p').el.nodeName);
console.log(dom('p', 'header').el.nodeName);
console.log(dom(document.querySelector('header')).el.nodeName);
console.log(dom({
    footer: 'footer',
    paragraphs: {
        header: 'header p',
        footer: 'footer p'
    }
}));

console.log("\n\n");
console.log(dom('[type="text"]').val());
console.log(dom('[type="radio"]').val());
dom('[type="radio"]').val('B');
// dom('[type="text"]').val('Krasimir Tsonev');

console.log(dom({
    name: '[type="text"]',
    data: {
        options: '[type="radio"]',
        count: 'select'
    },
    version: 'footer'
}, 'form').val()); */