console.log("+++++ Loading Utility: Modules +++++")
const path = require('path');
//const $LOCAL = 'C:\\Users\\foste\\OneDrive\\Repos\\CowHelper\\src\\'

const ISLOCAL = true;

let PATHS = {

    Duration: '../model/time.js',
    Army: '../model/army.js',
    Building: '../model/building.js',
    Combat: '../model/combat.js',
    Events: '../model/events.js',
    Faction: '../model/faction.js',
    Player: '../model/player.js',
    Territory: '../model/territory.js',
    Unit: '../model/unit.js'
}
/*
const LOCAL = {
    UnitData: 'C:\\Users\\foste\\OneDrive\\Repos\\CowHelper\\src\\data\\units.json',
    BuildingData: 'C:\\Users\\foste\\OneDrive\\Repos\\CowHelper\\src\\data\\buildings.json',
    Duration: 'C:\\Users\\foste\\OneDrive\\Repos\\CowHelper\\src\\model\\time.js',
    Army: 'C:\\Users\\foste\\OneDrive\\Repos\\CowHelper\\src\\model\\army.js',
    Building: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/building.js',
    Combat: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/combat.js',
    Events: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/events.js',
    Faction: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/faction.js',
    Player: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/player.js',
    Territory: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/territory.js',
    Unit: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/unit.js'
}*/

const LOCAL = {
    UnitData: `C:\\Users\\foste\\OneDrive\\Repos\\CowHelper\\src\\data\\units.json`,
    BuildingData: `C:\\Users\\foste\\OneDrive\\Repos\\CowHelper\\src\\data\\buildings.json`,
    Duration: `C:\\Users\\foste\\OneDrive\\Repos\\CowHelper\\src\\model\\time.js`,
    Army: `C:\\Users\\foste\\OneDrive\\Repos\\CowHelper\\src\\model\\army.js`,
    Building: `C:/Users/foste/OneDrive/Repos/CowHelper/src/model/building.js`,
    Combat: `C:/Users/foste/OneDrive/Repos/CowHelper/src/model/combat.js`,
    Events: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/events.js',
    Faction: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/faction.js',
    Player: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/player.js',
    Territory: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/territory.js',
    Unit: 'C:/Users/foste/OneDrive/Repos/CowHelper/src/model/unit.js'
}

ISLOCAL ? PATHS = LOCAL : PATHS = PATHS;


const Duration = require(PATHS.Duration)
const Army = require(PATHS.Army)
const Buildings = require(PATHS.Building)
const Combat = require(PATHS.Combat)
const Events = require(PATHS.Events)
const Faction = require(PATHS.Faction)
const Player = require(PATHS.Player)
const Territory = require(PATHS.Territory)
const Unit = require(PATHS.Unit)


const UnitData = require(PATHS.UnitData)
const BuildingData = require(PATHS.BuildingData)


exports.$DATA = {
    UnitData, BuildingData
}
exports.$MODEL = {
    Duration, Army, Buildings, Combat, Events, Faction, Player, Territory, Unit
}

// module.exports = {
//     UnitData,
//     BuildingData,
//     Duration,
//     Army,
//     Buildings,
//     Combat,
//     Events,
//     Faction,
//     Player,
//     Territory,
//     Unit
// }

// exports.data = { UnitData, BuildingData };
// exports.model = { Duration, Army, Buildings, Combat, Events, Faction, Player, Territory, Unit };
// exports.env = { ISLOCAL, PATHS };

//Usage:
/* const myModule = require('./myModule');
// Access the exported values
const { units, buildings, constants } = myModule;
console.log('Units:', units);
console.log('Buildings:', buildings);
console.log('Constants:', constants); 
In the main.js file, you destructure the exported object to get individual values 
(units, buildings, and constants).
=============================================================*/

/* =========================================================
const { other } = require('./myModule');

// Access the 'other' property
console.log('Buildings:', other.buildings);
console.log('Constants:', other.constants);
By destructuring { other } from the imported module, you’ll have access to the buildings and constants properties directly */