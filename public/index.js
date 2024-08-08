import * as DOM from "./utility/domFunctions.js";
import { SELECT_ELEMENTS as $ } from './utility/domFunctions.js';
//import * as CLOG from "./utility/devTools/customConsole.js";
import * as COW_LIST from "./custom/cow/shared/cow_reference.js";
//import { UNIT_TYPES } from "/utility/ref_data.js";
import * as _API from "./utility/cow_UnitData.js";


window.onload = initPage(DOM.getPageID());

function initPage(pageID){
  document.title = `CoW Helper: ${pageID}`;
  $.QS("cow-navbar").setPageTitle(pageID);

  if(pageID === "Unit Info"){

    document.addEventListener('unitSelected', (event) => {
      const unitValue = event.detail.unitValue;
      const doctrine = $.QS('cow-unitselector').$Doctrine
      //$.QS('[data-imageType="unitIcon"]').src=`${COW_LIST.UNIT_IMAGES.portraitPath}${unitValue.toLowerCase().replace(" ","")}${suffix}.png`
      _API.getUnitData(unitValue, doctrine);
    });

    $.QS('#level-up').addEventListener('click', ()=>{
      _API.populateUnitData((parseInt(_API.CurrentUnit.Level) +1).toString());
    });

    $.QS('#level-down').addEventListener('click', ()=>{
      _API.populateUnitData((parseInt(_API.CurrentUnit.Level) -1).toString());
    });
  }

};
