/**@module Unit*/
//Includes references to Faction instance, and Unit instances, but does not require the modules (at this point)
const { ModuleUtils } = require('../middleware/utility/utility');
let thisModule = new ModuleUtils("Stats")
thisModule.logLoad;
thisModule.TEST_MODE = false;
//========================================================================================================

const $TYPE = require("./globals")

class Strength {

    /**
     * Template for consistent objects representing the Attack / Defense values of a Unit / Army that only contains other Unit/Army classes.
     * Used for holding calculated attack values and army composition. This class is extended to contain full list (Building and Morale).  
     * Uses global enum "Unit Class" to generate properties consistently
     *
     * @constructor
     */
    constructor() {
        this.Attack = {};
        this.Defense = {}
        Object.keys($TYPE.UnitClass).forEach(Class => {
            this.Attack[Class] = 0
            this.Defense[Class] = 0
        })
        this.Attack.Buildings = 0
        this.Defense.Buildings = 0
        this.Attack.Morale = 0

    }
}

class Resources {
    constructor() {
        Object.keys($TYPE.Resource).forEach(Class => {
            this[Class] = 0
        })

    }
}

class TerrainSet {
    constructor(){
        Object.keys($TYPE.Terrain).forEach(terrain => {
            this[terrain] = 0
        })
    }
}


module.exports = { Strength, Resources, TerrainSet }

if (thisModule.TEST_MODE) { /*???????????????????????????????????????? TESTS ????????????????????????????????????????*/
    thisModule.logTestStart();
    //--------------- Tests Below: ---------------------------------

    let strengths = new Strength()
    console.log(strengths);

    let resources = new Resources()
    console.log(resources)
}
