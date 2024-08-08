/**@module Building*/
//Includes references to Faction instance, and Unit instances, but does not require the modules (at this point)
const { ModuleUtils } = require('../middleware/utility/utility');
let thisModule = new ModuleUtils("Building")
thisModule.logLoad;
thisModule.TEST_MODE = false;
//========================================================================================================

const BuildingData = require('../data/buildings.json');
const { Territory, City, Rural } = require('./territory');
const $TYPE = require('./globals');
const eventEmitter = require('./events');
const Duration = require('./time');

class Building {
    static Status = Object.freeze({
        //Constructing: Symbol("Constructing", {constant: true}),
        Damaged: Symbol("Damaged, in need of repair", {constant: true}),
        NotBuilt: Symbol("Not Built", {constant: true}),
        Functional: Symbol("Functional", {constant: true})
    })
    id;
    data;
    hp = {
        max: 0,
        current: 0
    }
    level = { //defaults lowest levels possible, updated per building type
        current: 1,
        max: 3
    }
    isFunctional = false; //not functional while being built, or when < 100% hp and level 1

    buildProgress = {
        moraleEffect: 0,
        isBuilding: false,
        totalTime: 0,
        remainingTime: 0,
        percentage: 0,
        bar: ""
    };
    
    /**
     * Creates an instance of Building.
     *
     * @constructor
     * @param {Territory | City | Rural} territory Likely to be called by territory, so territory param will be passed as "this"
     * @param {number} [level=1]
     * @param {boolean} [instantBuild=false] Set to true to ignore build times. Only used for de-bugging and development purposes, to be removed / disabled for production
     */
    constructor(territory, level = 1, instantBuild = false) {
    //Likely to be called by territory, so territory param will be passed as "this"
    //Maybe some validation occurs at that stage before this constructor is even called?

        //this.validation(territory, level);
            //if validation true, continue - else catch error and cancel
            //check can it built in this type of territory?
            //check if building exists in this territory
        this.level.current = level;
        
        eventEmitter.on('globalTick', this.updateConstruction.bind(this));

        instantBuild ? this.buildProgress.percentage = 100 : this.buildProgress.percentage = 0
        this.hp.current = this.buildProgress.percentage * this.hp_max || 0

        //this.makeProgressBar();
    }
    updateData(level) {
        this.data = buildings[this.TYPE][level]

        this.buildTime = new Duration(this.data.Cost.Time)
        this.hp.max = this.data.Hitpoints
        this.buildProgress.remainingTime = this.buildTime.toSeconds()

    }
    
    /** Description placeholder */
    updateConstruction() {
        //console.log(`Building Progress: ${this.buildProgress}%`)
        if (this.buildProgress.percentage > 1) {
            this.buildProgress.percentage = 1;
            this.buildProgress.isBuilding = false;
            this.isFunctional = true;
        }
        if (this.buildProgress.percentage < 1 && this.buildProgress.isBuilding) {
            this.buildProgress.remainingTime--
            this.buildProgress.percentage = ((this.buildTime.toSeconds() - this.buildProgress.remainingTime) / this.buildTime.toSeconds())

            this.makeProgressBar();
        }

    }
    set isBuilding(bool) {
        this.buildProgress.isBuilding = bool;
    }
    makeProgressBar() {
        this.buildProgress.bar = "["
        //Add dashes for progress
        for (let i = 0; i < Math.round(this.buildProgress.percentage * 10); i++) {
            this.buildProgress.bar += "-"
        }
        //Add spaces for remaining progress (keeps width even)
        for (let j = 0; j < Math.round(10 - this.buildProgress.percentage * 10); j++) {
            this.buildProgress.bar += " "
        }
        //Add closing bracket and percentage value
        this.buildProgress.bar += `] ${Math.floor(this.buildProgress.percentage * 100)}%`

        console.log(this.buildProgress.bar)
    }
}

class AircraftFactory extends Building {
    TYPE = $TYPE.Buildings.AircraftFactory
    canBuildIn = [Territory.$Type.City]
    /**
     * 
     * @param {*} territory 
     * @param {Number|String} level - Level of the building to create - max 5 for City buildings, 3 for all others
     * @param {Boolean} instantBuild - for debugging, skips any timer-based actions and creates the object at 100%
     */
    constructor(territory, level = 1, instantBuild = false) {
        super(territory, level, instantBuild);
        this.level.max = 5
        this.updateData(this.level.current)
    }
}



module.exports = {
        AircraftFactory
}


