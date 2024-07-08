//import { createRequire } from 'node:module'
//const require = createRequire(import.meta.url)


import * as REF from '../custom/cow/shared/cow_reference.js'
import * as API from './drq_handler.js'
//import * as CLOG from './devTools/customConsole.js'
import { SELECT_ELEMENTS as $ } from './domFunctions.js';
//import { Duration } from './model-time.js';
//const { Duration } = require('./model-time.js') // test is regular .js file using module.exports


export let CurrentUnit;

export function getUnitData(unitType, doctrine = "Axis") {
  //call API helper function with params to get the data to use to populate the screen
  API.getData('/getUnitData/getUnit/', `${unitType}/${doctrine}`)

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
        CurrentUnit = new Unit(unitType, dataObject);
        populateUnitData(CurrentUnit.Level);
      }
    })
}

export function _updateLevelArrow(unit) {
  $.ID('level-up').setAttribute('disabled', '');
  $.ID('level-down').removeAttribute('disabled', '');
  if (unit.Level === "1" || !(unit._Data[(parseInt(unit.Level) - 1).toString()])) {

    $.ID('level-down').setAttribute('disabled', '');
  }
  if (unit._Data[(parseInt(unit.Level) + 1).toString()]) {
    $.ID('level-up').removeAttribute('disabled', '');
  }
  if (unit.isElite) {
    $.ID('level-up').setAttribute('disabled', '');
  }
}

//export function populateUnitData(data, unitType, level) {
export function populateUnitData(level) {
  const $TBL = 'cow-statsTable[data-type=';
  CurrentUnit.update(level);
  //console.log("Current Unit: ", CurrentUnit)

  $.CL("infoCard")[0].style.display = "block";


  if (CurrentUnit.isElite) {
    $.QS('[data-imageType="levelIcon"]').src = `./custom/cow/shared/images/icons/levels/Elite.png`;
    $.ID("unitType").innerText = `${CurrentUnit.Type},\xa0`;
    $.ID("unitLevel").innerText = `Elite`;
  } else {
    $.QS('[data-imageType="levelIcon"]').src = `./custom/cow/shared/images/icons/levels/level${level}.png`;
    $.ID("unitType").innerText = `${CurrentUnit.Type}, Level.\xa0 `;
    $.ID("unitLevel").innerText = `${CurrentUnit.Level}`;
  }

  //Populate Unit Overview
  REF.BASICS.forEach(a => {
    $.QS(`${$TBL}"overview"]`).value = { target: a, value: CurrentUnit[a] }
  })

  REF.RESOURCES.forEach(r => {
    console.log("Current resource: ", r);
    if (r === "Time") {
      let props = ["Production", "Upgrade", "Research"], vars = {};
      props.forEach(p => {
        console.log("Current property: ", p)
        if (CurrentUnit.Cost[p] === undefined) {
          console.error(`${p}.Time is undefined. Setting blank`);
          CurrentUnit.Cost[p] = {}
        }
        if (CurrentUnit.Cost[p].Time !== undefined && typeof CurrentUnit.Cost[p].Time !== "string") {
          vars[`${p}Times`] = Object.values(CurrentUnit.Cost[p].Time);
          vars[`${p}Value`] = `${vars[`${p}Times`][0]}d ${vars[`${p}Times`][1]}h ${vars[`${p}Times`][2]}m`
        } else { vars[`${p}Value`] = CurrentUnit.Cost[p].Time }

        $.QS(`${$TBL}"costs"]`).value = { target: `Production-Time`, value: vars.ProductionValue }
        $.QS(`${$TBL}"research"]`).value = { target: `Research-Time`, value: vars.ResearchValue }
      })
      if (level !== "1") {
        $.QS(`${$TBL}"research"]`).value = { target: `Upgrade-${r}`, value: vars.UpgradeValue }
      }
    }//end time IF statement

    if(r !== "Time") {

      $.QS(`${$TBL}"costs"]`).value = { target: `Production-${r}`, value: CurrentUnit.Cost.Production[r] }
      $.QS(`${$TBL}"costs"]`).value = { target: `Upkeep-${r}`, value: CurrentUnit.Cost.Upkeep[r] }
      $.QS(`${$TBL}"research"]`).value = { target: `Research-${r}`, value: CurrentUnit.Cost.Research[r] }

      if ( level === "1" ) { $.QS(`${$TBL}"research"]`).value = { target: `Upgrade-${r}`, value: "-" } }
      else{ $.QS(`${$TBL}"research"]`).value = { target: `Upgrade-${r}`, value: CurrentUnit.Cost.Upgrade[r] }}
    }
  })

  REF.CLASSES.forEach(c => {
    $.QS(`${$TBL}"combat"]`).value = { target: `Attack-${c}`, value: CurrentUnit.Strength.Attack[c] }
    c === "Morale" ? "" : $.QS(`${$TBL}"combat"]`).value = { target: `Defense-${c}`, value: CurrentUnit.Strength.Defense[c] }
  })
  _updateLevelArrow(CurrentUnit);
}

export class Unit {
  constructor(type, data, level) {
    this._Data = data;
    this.Level = level || "1";
    this.Type = type;
    this.isElite = this._Data[this.Level].isElite;
    this.Hitpoints = this._Data[this.Level].Hitpoints;
    this.Speed = this._Data[this.Level].Speed;
    this.ViewRange = this._Data[this.Level].ViewRange;
    this.Strength = this._Data[this.Level].Strength;
    this.Cost = this._Data[this.Level].Cost;
  };
  update($L) {
    this.Level = $L;
    this.isElite = this._Data[this.Level].isElite;
    this.Hitpoints = this._Data[this.Level].Hitpoints;
    this.Speed = this._Data[this.Level].Speed;
    this.ViewRange = this._Data[this.Level].ViewRange;
    this.Strength = this._Data[this.Level].Strength;
    this.Cost = this._Data[this.Level].Cost
  }
}

/* export function toUpgradeCost(prodCost){
  let result;
  !isNaN(prodCost)? result = (parseInt(prodCost)/2).toString():result ="-"
  return result;
} */