import * as REF from '../custom/cow/shared/cow_reference.js'
import * as API from './drq_handler.js'
import * as CLOG from './devTools/customConsole.js'
import { SELECT_ELEMENTS as $ } from './domFunctions.js';

export let currentUnitdata ={
  type:"",
  level:"",
  data:{}
};
export const TABLE_NAMES = {
  "Unit_Overview": "overview",
  "Combat_Statistics": "combat",
  "Costs": "costs"
}

export function getUnitData(unitType) {

  /*   let unitType = document.getElementById('unitSelect').value;
    let level = document.getElementById('levelSelect').value; */

  API.getData('/getUnitData/getUnit/', unitType)

    .then(dataObject => {
      if (dataObject instanceof Error) {
        if (dataObject.name === "SyntaxError") {
          $.CL("infoCard")[0].style.display = "none"
          alert(`Unable to get data - likely cause, data doesn't exist in the dataset yet.\n\nDetails:\n${dataObject}`);
        } else {
          alert(`Unknown reason for error or error type:\n\nDetails:\n${dataObject}`)
        }
        throw dataObject;
      } else {
        currentUnitdata.type = unitType;
        currentUnitdata.data = dataObject;
        populateUnitData(currentUnitdata.data, currentUnitdata.type);
      }
    })
}
export function _updateLevelArrow(unit){
  $.ID('level-up').setAttribute('disabled','');
  $.ID('level-down').removeAttribute('disabled','');

  if (unit.level === "1" ||  !unit.data[(parseInt(unit.level)-1).toString()]){
    $.ID('level-down').setAttribute('disabled','');
  }
  if (unit.data[(parseInt(unit.level)+1).toString()]){
    $.ID('level-up').removeAttribute('disabled','');
  }
  if (unit.data.Elite){
    $.ID('level-up').setAttribute('disabled','');
  }
}

export function populateUnitData(data, unitType, level) {
  const $TBL = 'cow-statsTable[data-type=';
  !level ? level = "1" : level = level;
  
  currentUnitdata.level = level;
  const thisUnit = data[level];
  
  $.CL("infoCard")[0].style.display = "block";
  $.ID("unitType").innerText = `${unitType}, Lvl. `;
  $.ID("unitLevel").innerText = `${level}`;
  if (data[level].Elite){
    $.QS('[data-imageType="levelIcon"]').src=`./custom/cow/shared/images/icons/levels/Elite.png`
  }else{ $.QS('[data-imageType="levelIcon"]').src=`./custom/cow/shared/images/icons/levels/level${level}.png`}

  //Populate Unit Overview
  REF.BASICS.forEach(a => {
    $.QS(`${$TBL}"overview"]`).value = { target: a, value: thisUnit[a] }
  })

  REF.RESOURCES.forEach(r => {
    $.QS(`${$TBL}"costs"]`).value = { target: `Production-${r}`, value: thisUnit.Cost.Production[r] }
    $.QS(`${$TBL}"costs"]`).value = { target: `Upkeep-${r}`, value: thisUnit.Cost.Upkeep[r] }
    $.QS(`${$TBL}"research"]`).value = { target: `Cost-${r}`, value: thisUnit.Cost.Research[r] }
  })

  REF.CLASSES.forEach(c => {
    $.QS(`${$TBL}"combat"]`).value = { target: `Attack-${c}`, value: thisUnit.Strength.Attack[c] }
    c === "Morale" ? "" : $.QS(`${$TBL}"combat"]`).value = { target: `Defense-${c}`, value: thisUnit.Strength.Defense[c] }
  })
  _updateLevelArrow(currentUnitdata);
}


