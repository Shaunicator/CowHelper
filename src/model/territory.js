console.log("Loading Module: Territory")
//const { data } = require('../_modules.js');
//const { data } = require('C:/Users/foste/OneDrive/Repos/CowHelper/src/middleware/_modules.js')

const $TYPE = require('C:/Users/foste/OneDrive/Repos/CowHelper/src/model/globals')
//const {$DATA , $MODEL} = require('../middleware/_modules')

const PRODUCTION_MINIMUM = 0.2375;
const min = PRODUCTION_MINIMUM;
class Territory {
    static #baseOutput = { money: 600, manpower: 450 }
    terrainType;
    modifierStates = {
        hasAirfield: false,
        hasDock: false, //check if isCoastal somehow
        fortificationLevel: 0
    }
    #output = { money: 0, manpower: 0 }
    country;
    buildings = new Map(); //buildings currently completed in territory
    buildQueue = {
        buildings: new Map()
        //excluded units queue in default, as it is only applicable for cities
    }
    morale = {
        current: 70,
        target: 102
    }
    /**
     * @param { string } territoryName The name of the territory or city
     * @param { Faction } faction Faction class object as symbolic link to the current controlling faction 
     * @param { string } country Name of the entity (faction, country or whatever) that originally controlled the territory. Used to determine core territories
     */
    constructor(territoryName, faction, country, terrainType) {
        this.baseOutput = Territory.#baseOutput;
        this.territoryName = territoryName;
        this.owner = faction.name
        this.ownerID = faction.id
        this.country = country || faction.name;
        this.isCore = this.owner === this.country ? true : false //determine if it is core territory for the controlling faction
        this.type = this.constructor.name
        this.updateOutput(Territory.#baseOutput)

        //put in some validtion before adding to list
        faction.addTerritory(this)

    }
    updateOutput(base) {
        let type = Object.keys(base)
        //console.log("Updating production output");
        type.forEach(t => {
            //console.log("Updating for: ", t)
            let bonus = this.getProductionBonus(t) || 0
            this.#output[t] = this.calculateOutput(base[t], this.morale.current / 100, bonus)
        })
    }
    //Abstract this out more, with params
    calculateOutput(Base, morale, bonus = 0) {
        //(BaseOutput+(BaseOutput*Bonus))*(MINPROD+(1-MINPROD)*Morale))
        //console.log(`${Base} + (${Base} * ${bonus})) * (${min} + ((1 - ${min}) * ${morale}) = ${Math.round((Base + (Base * bonus)) * ((min) + ((1 - min) * (morale))))}`);
        let coreMod = this.isCore ? 1 : 0.25
        return Math.round((Base + (Base * bonus)) * ((min) + ((1 - min) * (morale))) * coreMod)
    }
    get output() {
        return this.#output;
    }
    set setMorale(newValue) {
        this.morale.current = newValue;
        this.updateOutput(this.baseOutput)
    }

    getProductionBonus(targetResource) {
        let targetBuilding;
        if (targetResource === "manpower") {
            targetBuilding = ""
            
        } else {
            this.type === $TYPE.Territory.City.description ? targetBuilding = $TYPE.Buildings.Industry : targetBuilding = $TYPE.Buildings.LocalIndustry
        }
        this.buildings.forEach((value, key)=>{
            if(value.TYPE === targetBuilding){
                return 0 //change to value
            }else{
                return 0
            }
        })
    }
}


// ++++++++++++++++++++++++++++++++++++++ Class: City ++++++++++++++++++++++++++++++++++++++++++++
class City extends Territory {
    static #baseOutput = {
        resource: 6000,
        money: 6000,
        manpower: 600
    }
    #output = { resource: 0, money: 0, manpower: 0 }
    constructor(territoryName, faction, country, terrainType = $Type.Terrain.Urban, resourceType) {
        super(territoryName, faction, country);
        this.country = country;
        this.terrainType = terrainType;
        this.resourceType = resourceType;
        this.baseOutput = City.#baseOutput;
        this.updateOutput(City.#baseOutput, this.buildings);
        this.buildQueue.units = new Map();

    }
}

// ++++++++++++++++++++++++++++++++++++++ Class: Rural ++++++++++++++++++++++++++++++++++++++++++++
class Rural extends Territory {
    static #baseOutput = {
        resource: 1500,
        money: 900,
        manpower: 150
    }
    constructor(territoryName, faction, country, terrainType, resourceType) {
        super(territoryName, faction, country, terrainType);
        this.resourceType = resourceType;
        this.terrainType = terrainType;
        this.country = country;
        this.baseOutput = Rural.#baseOutput;
        this.updateOutput(Rural.#baseOutput, this.buildings);

    }
}

module.exports = { Territory, City, Rural }

//Morale
// Province morale gravitates towards 102, while rising for roughly 14% of the missing morale. When reaching 100 morale it stops though.
// If you have negative morale influences, subtract them from 102. If you have positive influences, add them.

//Garrison
//Its the best rating of the unit (attack, defense, AA) with terrain effects included


