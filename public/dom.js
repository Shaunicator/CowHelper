/* async function getPromise(url) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "omit", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
        })

        const data = await response.json();
        console.log(data);
        console.log(data["unitData"]["Infantry"]["1"]["Hitpoints"]);
        let textField = document.getElementById("serverText")
        textField.innerText = "Hitpoints: " + data["unitData"]["Infantry"]["1"]["Hitpoints"]
        return data.json();
        
      } */

let dataObject;

function getData(url,){
  let unitType = document.getElementById('unitSelect').value;
  let level = document.getElementById('levelSelect').value;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    dataObject = data;
  }).then(()=>{
    document.getElementsByClassName("infoCard")[0].style.display="block"
    document.getElementById("unitType").innerText = `${unitType}, Lvl. ${level}`;
    document.getElementById('hitpoints').innerText = dataObject.unitData[unitType][level]["Hitpoints"];
    document.getElementById('speed').innerText = dataObject.unitData[unitType][level]["Speed"];
    document.getElementById('view').innerText = dataObject.unitData[unitType][level]["ViewRange"];
    document.getElementById('attackRange').innerText = dataObject.unitData[unitType][level]["AttackRange"];

    document.getElementById('prod-food').innerText = dataObject.unitData[unitType][level]["Cost"]["Production"]["Food"];
    document.getElementById('prod-goods').innerText = dataObject.unitData[unitType][level]["Cost"]["Production"]["Goods"];
    document.getElementById('prod-metal').innerText = dataObject.unitData[unitType][level]["Cost"]["Production"]["Metal"];
    document.getElementById('prod-oil').innerText = dataObject.unitData[unitType][level]["Cost"]["Production"]["Oil"];
    document.getElementById('prod-rare').innerText = dataObject.unitData[unitType][level]["Cost"]["Production"]["Rare"];
    document.getElementById('prod-mp').innerText = dataObject.unitData[unitType][level]["Cost"]["Production"]["Manpower"];
    document.getElementById('prod-money').innerText = dataObject.unitData[unitType][level]["Cost"]["Production"]["Money"];

    document.getElementById('upk-food').innerText = dataObject.unitData[unitType][level]["Cost"]["Upkeep"]["Food"];
    document.getElementById('upk-goods').innerText = dataObject.unitData[unitType][level]["Cost"]["Upkeep"]["Goods"];
    document.getElementById('upk-metal').innerText = dataObject.unitData[unitType][level]["Cost"]["Upkeep"]["Metal"];
    document.getElementById('upk-oil').innerText = dataObject.unitData[unitType][level]["Cost"]["Upkeep"]["Oil"];
    document.getElementById('upk-rare').innerText = dataObject.unitData[unitType][level]["Cost"]["Upkeep"]["Rare"];
    document.getElementById('upk-mp').innerText = dataObject.unitData[unitType][level]["Cost"]["Upkeep"]["Manpower"];
    document.getElementById('upk-money').innerText = dataObject.unitData[unitType][level]["Cost"]["Upkeep"]["Money"];

    document.getElementById('prod-time').innerText = dataObject.unitData[unitType][level]["Cost"]["Production"]["Time"];

    document.getElementById('atk-una').innerText = dataObject.unitData[unitType][level]["Strength"]["Attack"]["Unarmored"];
    document.getElementById('atk-light').innerText = dataObject.unitData[unitType][level]["Strength"]["Attack"]["Light"];
    document.getElementById('atk-heavy').innerText = dataObject.unitData[unitType][level]["Strength"]["Attack"]["Heavy"];
    document.getElementById('atk-air').innerText = dataObject.unitData[unitType][level]["Strength"]["Attack"]["Air"];
    document.getElementById('atk-sea').innerText = dataObject.unitData[unitType][level]["Strength"]["Attack"]["Ship"];
    document.getElementById('atk-sub').innerText = dataObject.unitData[unitType][level]["Strength"]["Attack"]["Sub"];
    document.getElementById('atk-build').innerText = dataObject.unitData[unitType][level]["Strength"]["Attack"]["Building"];
    document.getElementById('atk-morale').innerText = dataObject.unitData[unitType][level]["Strength"]["Attack"]["Morale"];

    document.getElementById('def-una').innerText = dataObject.unitData[unitType][level]["Strength"]["Defense"]["Unarmored"];
    document.getElementById('def-light').innerText = dataObject.unitData[unitType][level]["Strength"]["Defense"]["Light"];
    document.getElementById('def-heavy').innerText = dataObject.unitData[unitType][level]["Strength"]["Defense"]["Heavy"];
    document.getElementById('def-air').innerText = dataObject.unitData[unitType][level]["Strength"]["Defense"]["Air"];
    document.getElementById('def-sea').innerText = dataObject.unitData[unitType][level]["Strength"]["Defense"]["Ship"];
    document.getElementById('def-sub').innerText = dataObject.unitData[unitType][level]["Strength"]["Defense"]["Sub"];
    document.getElementById('def-build').innerText = dataObject.unitData[unitType][level]["Strength"]["Defense"]["Building"];
    
  })
}

function logData(){
  console.log(dataObject)
}

function loadData(data){
    console.log(data);
  }