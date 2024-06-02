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
    document.getElementsByClassName("table_component")[0].style.display="block"
    document.getElementById("unitType").innerText = `${unitType}, Level ${level}`;
    document.getElementById('hitpoints').innerText = dataObject.unitData[unitType][level]["Hitpoints"];
    document.getElementById('speed').innerText = dataObject.unitData[unitType][level]["Speed"];
    document.getElementById('view').innerText = dataObject.unitData[unitType][level]["ViewRange"];
    document.getElementById('attackRange').innerText = dataObject.unitData[unitType][level]["AttackRange"];
  })
}

function logData(){
  console.log(dataObject)
}

function loadData(data){
    console.log(data);
  }