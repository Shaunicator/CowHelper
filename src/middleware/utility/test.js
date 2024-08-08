const $TYPE = require('C:/Users/foste/OneDrive/Repos/CowHelper/src/model/globals')
const { Utility } = require('./utility')
const { Faction } = require('../../model/faction')

const {Territory, City, Rural} = require('../../model/territory')

const TESTS = {
    createTerritories: false
}

let FACTION_CA = new Faction("Central America")
console.log(FACTION_CA.constructor.name)
let factionName = FACTION_CA.name.replace(" ","");
let Territories = {}
Territories[factionName] = {}



const Start = { //Objects and Arrays of starting territory data
    Cities: new Map([
        ["Guatemala", $TYPE.Resource.Food],
        ["La Ceiba", $TYPE.Resource.Metal],
        ["San Jose", $TYPE.Resource.Oil],
        ["San Salvador", $TYPE.Resource.Goods],
        ["Tegucigalpa", $TYPE.Resource.Rare],
    ]),
    Rural: new Map([
        ["Bluefields", $TYPE.Resource.Metal],
        ["Guapiles", $TYPE.Resource.Goods],
        ["Matagalpa", $TYPE.Resource.Oil],
        ["Puerto Cortez", $TYPE.Resource.Food],
        ["San Pedro Sula", $TYPE.Resource.Food],
        ["Santa Rosa de Copan", $TYPE.Resource.Goods]
    ]),
    Territory: [
        "Choluteca", "Coban", "El Estor", "Escuintia",
        "Flores", "Juticalpa", "Lempira", "Limon",
        "Managua", "Prinzapolka", "Quetzaltenango",
        "San Miguel", "Sulaco", "Tocoa"
    ]
}

if(TESTS.createTerritories){
//moved to utility module (const { Utility } = require('./utility'))
// let randomValue = function (obj) {
//     var keys = Object.keys(obj);
//     return obj[keys[ keys.length * Math.random() << 0]];
// };

// Start.Cities.forEach((res, Name) => {
//     Territories[factionName]["City" + faction.id+(Object.keys(Territories[factionName]).length +1).toString()] = new City(Name, faction, faction.name, $TYPE.Terrain.Urban, res);
//  })
 Start.Cities.forEach((res, Name) => {
    Territories[factionName]["City" + FACTION_CA.id+(Object.keys(Territories[factionName]).length +1).toString()] = new City(Name, FACTION_CA, FACTION_CA.name, $TYPE.Terrain.Urban, res);
 })

//  Start.Rural.forEach((res, Name) => {
//     Territories[factionName]["Rural" + faction.id+(Object.keys(Territories[factionName]).length +1).toString()] = new Rural(Name, faction, faction.name, randomValue($TYPE.Terrain), res );
// })
Start.Rural.forEach((res, Name) => {
    Territories[factionName]["Rural" + FACTION_CA.id+(Object.keys(Territories[factionName]).length +1).toString()] 
    = new Rural(
        Name, 
        FACTION_CA, 
        FACTION_CA.name, 
        Utility.getRandomObjectValue($TYPE.Terrain), 
        res );
})

// Start.Territory.forEach((territory) =>{
//     Territories[factionName]["Territory" + faction.id+(Object.keys(Territories[factionName]).length +1).toString()] = new Territory(territory, faction, faction.name, randomValue($TYPE.Terrain));
// })
Start.Territory.forEach((territory) =>{
    Territories[factionName]["Territory" + FACTION_CA.id+(Object.keys(Territories[factionName]).length +1).toString()] 
        = new Territory(
            territory, 
            FACTION_CA, 
            FACTION_CA.name, 
            Utility.getRandomObjectValue($TYPE.Terrain));
})

console.log(FACTION_CA.totalOutput)
 /*
Money:      80k     1349/h
Manpower:   12k     259/h
Food:       15k     240/h
Goods:      15k     248/h
Metal:      15k     232/h
Oil:        15k     234/h
Rare:       10k     191/h
*/
}