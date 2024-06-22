import * as DOM from "./utility/domFunctions.js";
import { SELECT_ELEMENTS as $ } from './utility/domFunctions.js';
//import * as CLOG from "./utility/devTools/customConsole.js";
import * as COW_LIST from "./custom/cow/shared/cow_reference.js";
//import { UNIT_TYPES } from "/utility/ref_data.js";
import * as TEST from "/utility/unitTests.js";
import * as _API from "./utility/cow_UnitData.js";
import { currentUnitdata as _$unit } from "./utility/cow_UnitData.js";

window.onload = initPage(DOM.getPageID());

function initPage(pageID){
  document.title = `CoW Helper: ${pageID}`;
  $.QS("cow-navbar").setPageTitle(pageID);

  if(pageID === "Unit Info"){

    document.addEventListener('unitSelected', (event) => {
      const unitValue = event.detail.unitValue;
      $.QS('[data-imageType="unitIcon"]').src=`${COW_LIST.UNIT_IMAGES.portraitPath}${unitValue.toLowerCase().replace(" ","")}_1.png`
      _API.getUnitData(unitValue);
    });

    $.QS('#level-up').addEventListener('click', ()=>{
      _API.populateUnitData(_$unit.data, _$unit.type, (parseInt(_$unit.level) +1).toString());
    });

    $.QS('#level-down').addEventListener('click', ()=>{
      _API.populateUnitData(_$unit.data, _$unit.type, (parseInt(_$unit.level) -1).toString());
    });
  }

};
