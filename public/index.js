import * as DOM from "./utility/domFunctions.js";
import * as CLOG from "./utility/devTools/customConsole.js";
import * as COW_LIST from "./custom/cow/shared/cow_reference.js";
//import { UNIT_TYPES } from "/utility/ref_data.js";
import { RUN_UNIT_TESTS } from "/utility/unitTests.js";

import * as COW_API from "./utility/cow_UnitData.js";
const ENABLE_LOGS = false;
const VERSION = "v0.2.0 (dev)";
const HEADER = "Call of War Helper: Home";

window.onload = initPage(DOM.getPageID());

function initPage(pageID){
  document.addEventListener('unitSelected', (event) => {
    console.log("Custom event fired");
    const unitValue = event.detail.unitValue;
    document.querySelector('.unitTypeinfo img').src=`${COW_LIST.UNIT_IMAGES.portraitPath}${unitValue.toLowerCase()}_1.png`
    COW_API.populateUnitData(unitValue);
  });
 let fn = CLOG.start( `Page: ${pageID}` )
  document.getElementById( "pageHeader" ).innerText = HEADER;
  document.getElementById( "version" ).innerText = VERSION;
/*  
  DOM.createOptionsSet(COW_LIST.UNIT_TYPES, "unitSelect" );
  document.querySelector("option[value='Infantry']").setAttribute('selected','')
  new DOM.Element(
    "button",{"id":"getData"},["Get Data"],
    new DOM.Listener("click",COW_API.populateUnitData,{},null), 
    document.getElementById("unitSelector"))
    .create(); */
}



if(RUN_UNIT_TESTS){
  /* Unit Test function(s) here*/
}
