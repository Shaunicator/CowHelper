import * as REF from '../custom/cow/shared/cow_reference.js'
import * as API from './drq_handler.js'

export const TABLE_NAMES = {
  "Unit_Overview":"overview",
  "Combat_Statistics":"combat",
  "Costs":"costs"
}

export function populateUnitData(unitType) {

/*   let unitType = document.getElementById('unitSelect').value;
  let level = document.getElementById('levelSelect').value; */
  let level ="1";
  API.getData('/unitData/getUnit/',unitType)
  
    .then(dataObject => {
      console.log(dataObject);
      !level ? level = "1" : level = level;
    
      document.getElementsByClassName("infoCard")[0].style.display = "block"
      document.getElementById("unitType").innerText = `${unitType}, Lvl. ${level}`;

      //Populate Unit Overview
      REF.BASICS.forEach(a => { 
       document.querySelector(`cow-statsTable[data-type="overview"]`).value = {target: a, value: dataObject[level][a]}
      })

      REF.RESOURCES.forEach(r => {
        document.querySelector(`cow-statsTable[data-type="costs"]`).value = { target: `Production-${r}`, value: dataObject[level].Cost.Production[r]}
        document.querySelector(`cow-statsTable[data-type="costs"]`).value = { target: `Upkeep-${r}`, value: dataObject[level].Cost.Upkeep[r]}
      })

      REF.CLASSES.forEach(c => {
        document.querySelector('cow-statsTable[data-type="combat"]').value = {target: `Attack-${c}`, value: dataObject[level].Strength.Attack[c]}
        c === "Morale" ? "" : document.querySelector('cow-statsTable[data-type="combat"]').value = {target:`Defense-${c}` , value:dataObject[level].Strength.Defense[c] }
      })
    })
  
}
