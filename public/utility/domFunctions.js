/**
 * @module domFactory
 * @requires module:customConsole 
 */

import * as CLOG from "./devTools/customConsole.js";

/**Creates an HTML Element - inputs: "type", {attributes}, [childrenElements], {eventListener} */
export class Element {
  /**@type {String[]} Set of strings for valid HTML Element types  - expand as neccessary*/
  static validTypes = ["div", "select", "button", "option", "label", "optgroup", "cow-statsTable"];
  /**
   * Creates an HTML element, with attributes, children and eventListener if supplied
   * @param {"string"} type - Type: Name of HTML Element Type (must be included in static Set validTypes)
   * @param {?Object<string,string>} atr - Set of {Attribute:Value} pairs to be applied to element
   * @param {?Array<string|HTMLElement} children - Array of HTML Elements or strings to be appended to the created element
   * @param {?Listener} listener - Event Listener - 
   * @param {?HTMLElement} [target] An HTMLElement from query selector to append new element to.
   * @example const newButton = new ElementWithListener('button', { id: 'myButton', class: 'btn' },
   * [], 'click', () => * console.log('Button clicked!');});
   */
  constructor(type, atr, children=[], listener, target=null) {
    this.type = type;
    this.atr = atr;
    this.children = children;
    this.listener = listener;
    this.target = target;
    //this.validTypes = this.validTypes;
  };
  /**
   * Checks validity of all inputs and returns result. Only true if all checks pass.
   * @returns {boolean} Result of validation checks
   */
  validateInput() {
    /*Initialise Debug (functionName, [array of input variables to Log]*/
    let fn = CLOG.start(`Element.validateInput(${this.type})`,
      { "Type": [this.type], "Attribute": [this.atr], "Children": [this.children] });

    try { //check type matches list of valid HTML Element types
      if (Element.validTypes.includes(this.type.toLowerCase()) === false) {
        throw new Error(`${this.type} is not a valid HTML element`);
      }
    } catch (exception) {
      exception.name === 'TypeError'
        ? CLOG.Err("Type", exception.message, fn)
        : CLOG.Err("Input", exception.message, fn, "Ensure first value is a valid HTML element, and exists in validTypes set")
      return false;
    };

    //Check Attributes is valid object, add empty object if it doesn't exist
    CLOG.custom("Checking attributes", CLOG.icons.search, fn);
    try {
      if (!this.atr || (this.atr && Object.keys(this.atr).length === 0) || this.atr === null) {
        this.atr = {};
      } else { 
    CLOG.custom("Attributes valid", CLOG.icons.tick, fn) 
        };
    } catch (exception) {
      CLOG.Err(exception.name, exception.message, fn, `Unknown error - see stack:`);
      console.debug(exception.stack);
      return false;
    };

    //Check if children is array object
    CLOG.custom('Checking children', CLOG.icons.search, fn);

    if (this.children && Array.isArray(this.children) === false) {
      CLOG.Err("Type", "Children must be in an array", fn,)
      return false;
    } 
    else {
      if (!this.children || this.children === 'undefined' || this.children === null) {
        //set empty children array
      CLOG.custom("Children is null or not supplied, setting to empty array", CLOG.icons.message)
        this.children = [];
      } 
      else if (this.children.length) {
      CLOG.custom(`Length of children array: ${this.children.length}`, CLOG.icons.search, fn);
        //for each member, check if Node Element or string
        this.children.forEach(c => {

          CLOG.custom(`Child data type = ${typeof c}`,CLOG.icons.type,fn);

          if (typeof c !== 'string' && typeof c !== "HTMLElement") {
            CLOG.Err("Type", `Type of data is ${typeof c}. Children can only be strings or HTMLElements(nodes)`, fn);
            return false;
          }
        })
      }
    }
    //check event listener
    CLOG.end(fn, CLOG.custom(`Validation for ${this.type} is complete`, CLOG.icons.tick, "", true));
    return true;
  }
  /**
   * 
   * @returns 
   */
  create() {
    let fn = CLOG.start(`Element.create(${this.type})`)
    //Try validating the data here, if it fails throw and exit, else continue with creating element
    if (!this.validateInput()) {
      CLOG.Err("Validation", `Validation for ${this.type} failed. Returning null object.`, fn, "Check logs for failed item and resolve")
      return null;
    } else {
      let fn = CLOG.start(`Element.create(${this.type})`)
      const newEl = document.createElement(this.type);

      if (Object.keys(this.atr).length > 0) {
        //Apply each key/value pair found in the options object we pass in.
        for (let a in this.atr) {
          CLOG.ValueOf({ "Setting next attribute": this.atr }, fn)
            newEl.setAttribute(a, this.atr[a])
        };
      }

      if (this.children.length !== 0) {
        //Handle children - both strings and anything else
        this.children.forEach(c => {
        CLOG.ValueOf({ "Adding next child": c }, fn)

          if (typeof c === 'string') {
            newEl.appendChild(document.createTextNode(c))
          } else {
            newEl.appendChild(c)
          }
        })
      }
      if(!Object.is(this.listener,null) && Object.keys(this.listener).length > 0 && this.listener !== null){
        const {event, listener, opts, capture} = this.listener;
        newEl.addEventListener(event, listener, opts, capture);
      }

      CLOG.end(fn, `Element created: ${this.type}`)
      if(this.target && this.target !== null){
        this.target.appendChild(newEl);
      }else return newEl;
    }
  }
}



/**
 * 
 * @param {ArrStr | ObjStrStr | ObjStrArr | ObjStrObj} input Object containing the options to be created.
 * @param {?string} target - id of target element to append options to. If blank, will return a set of options
 * @returns {?Object[]} Only if target is blank or null, returns set of HTML Elements with 
 */
export function createOptionsSet(input, target) {
  let fn = CLOG.start(`createOptionSet(${target})`);

  /**@type {Array} output: stores built option Elements to be returned if no target */
  let output = [];

  //Analyse data structure of input to determine how to handle it
    CLOG.custom("Checking structure of input", CLOG.icons.search, fn)
  let str = identifyStructure(input);

  switch (str.typeDef) {
    //should be one of ArrStr | ObjStrStr | ObjStrArr | ObjStrObj
    case null || 'undefined': //unable to identify structure of input, throw custom Input Error
      CLOG.Err("Data", "Cannot determine structure of input", fn,
        "Should be should be one of ArrStr | ObjStrStr | ObjStrArr | ObjStrObj");
      return null;

    case "ArrStr": //Array of strings: input = ["value", "value"....]
      input.forEach(val => {
        let thisOption = new Element("option", { "value": val }, [val], null).create();

        target ? document.getElementById(target).appendChild(thisOption) : output.push(thisCategory);
      });
      break;

    case "ObjStrStr": //Object of string key, string value pairs: input = {"key":"value", "key":"value"...}
      for (let key in input) {
        let thisOption = new Element("option", { "value": key }, [input[key]], null).create();

        target ? document.getElementById(target).appendChild(thisOption) : output.push(thisCategory);
      }
      break;

    case "ObjStrArr": //Object of string category key, array of strings as value: input = {"head_key": ["value", "value"....]}
      for (let key in input) {

        CLOG.ValueOf({ "Key:": key }, fn)

        let thisCategory = new Element("optgroup", { "label": [key] }, [], null).create();

        input[key].forEach(val => {
          let thisOption = new Element("option", { "value": val }, [val], null).create();

          CLOG.ValueOf({ "thisOption as Element": thisOption }, fn);

          thisCategory.appendChild(thisOption);
        })
        target ? document.getElementById(target).appendChild(thisCategory) : output.push(thisCategory);
      }
      break;

    case "ObjStrObj": //Object of string category key, object of string key-value pairs: input = {"head_key": {"key":"value", "key":"value"...}}
      for (let groupKey in input) {
        let thisCategory = new Element("optgroup", { "label": groupKey }, [], null).create();

        for (let key in groupKey) {
          let thisOption = new Element("option", { "value": key }, [groupKey[key]], null).create();
          thisCategory.appendChild(thisOption);
        }
        target ? document.getElementById(target).appendChild(thisCategory) : output.push(thisCategory);
      }
      break;
  }
  if (!target) {
    CLOG.Custom("Returning output list", "🔙", fn)
    return output;
  }
}

/**@typedef {Array<string>} ArrStr An array of strings*/
/**@typedef {Object<string, string>} ObjStrStr An Object with sets of string key, string value pairs*/
/**@typedef {Object<string, Array>} ObjStrArr An object with a string head key, with an array of strings as the value*/
/**@typedef {Object<string, Object<string,string>} ObjStrObj An object with a string head key, with an object of key-value pairs as the value*/

/**
 * 
 * Analyses the structure of an object to determine how to handle it. Currently identifies 4 types of structures defined as custom typeDefs
 * @type {ArrStr | ObjStrStr | ObjStrArr | ObjStrObj}
 * @param {Object[]} data Object to be analysed
 * @requires module:customConsole
 * @returns {Object<string,bool>} Object with typeDef name, and hasHeadKey bool
 *
 */
export function identifyStructure(data) {

  let fn = CLOG.start("identifyStructure", { "Data": data })

  if (Array.isArray(data)) {
    //Check if it's an array of strings
    if (data.every(item => typeof item === 'string')) {
      CLOG.end(fn,`Structure identified - returning ArrStr`)
      return { typeDef: "ArrStr", hasHeadKey: false };
    }

  } else if (typeof data === 'object' && !Array.isArray(data)) {

    // Check if it's an objects with string key-value pairs
    let allStrings = true;
    for (let key in data) {
      if (typeof data[key] !== 'string') {
        allStrings = false;
        break;
      }
    }
    //Check if values are all strings
    if (allStrings) {
      CLOG.end(fn,`Structure identified - returning ObjStrStr`)
      return { typeDef: "ObjStrStr", hasHeadKey: false };
    }
    // Check if it's an object with string keys leading to arrays
    let allKeyArr = true;
    for (let key in data) {
      if (!Array.isArray(data[key])) {
        allKeyArr = false;
        break;
      }
    }
    if (allKeyArr) {
      CLOG.end(fn,`Structure identified - returning ObjStrArr`)
      return { typeDef: "ObjStrArr", hasHeadKey: true };
    }
    // Check if it's an object with string keys leading to objects
    let allKeyObj = true;
    for (let key in data) {
      if (typeof data[key] !== 'object' || Array.isArray(data[key])) {
        allKeyObj = false;
        break;
      }
    }
    if (allKeyObj) {
      CLOG.end(fn,`Structure identified - returning ObjStrObj`)
      return { typeDef: "ObjStrObj", hasHeadKey: true };
    }
  }
  CLOG.end(fn,`Structure not identified - returning null`)
  return { typeDef: null, hasHeadKey: null };
};

export function elementToHTML(element) {
  let fn = CLOG.start("ElementToHTML");
  //put in some validation here

  let toHTML = element.outerHTML;
  CLOG.ValueOf({ "Conversion result": toHTML }, fn)
  CLOG.End(fn)
  return toHTML;
}



/**
* If HTML title has "id" attribute describing page name, returns the id value. Used for log context or dynamic page building from pre-set configs
* @returns { string } Page ID
* @example <title id="index">This is the home page</title> returns "index".
*/
export const getPageID = function () {
  if (document.getElementsByTagName("title")[0].id) {
    return document.getElementsByTagName("title")[0].id;
  } else {
    CLOG.Err("Data", "No id attribute in HTML title - page cannot use config template", 'getPageID', 'Add an id="pageID" for page <title>')
    return null
  }
};


/**
 * Constructor function for creating Listener objects to pass to Element class, so EventListeners can be added
 * @param {string} event 
 * @param {Function} listener 
 * @param {Object<string,boolean>}
 * @param {boolean} capture 
 */
export function Listener(event, listener, options={}, capture=false) {
  this.event = event;
  this.listener = listener;
  this.options = options;
  this.capture = capture;
};

export function placeholderCallback(event) {
  const {srcElement:source, type} = event;
  CLOG.Err("Event",`Placeholder Event triggered by ${type} from ID ${source.id}`,"placeHolder","Replace with approriate function");
}


