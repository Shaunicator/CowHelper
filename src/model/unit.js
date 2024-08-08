/**@module Unit*/
//Includes references to Faction instance, and Unit instances, but does not require the modules (at this point)
const { ModuleUtils } = require('../middleware/utility/utility');
let thisModule = new ModuleUtils("Unit")
thisModule.logLoad;
thisModule.TEST_MODE = true;
//========================================================================================================
const $MR = require('more-rounding');
const $TYPE = require('./globals')
const UnitData = require('../data/units.json')
const Utility = require('../middleware/utility/utility');
const { Strength, Resources, TerrainSet } = require('./stats');
const { Duration } = require('./time');


/**
 * Base class that represents a single unit, so that individual unit types and stats can be tracked and changed. 
 * Cannot exist on it's own and must be a member of the Army class, as well as belonging to an owning Faction class instance.
 */
class Unit {

    /** 
     * @type {string} Auto-generated unique alpha string, combined with Faction unique ID 
     * @example "AA-ABCDE"
     */
    id;
    /**Id of the Army instance the unit currently belongs to (do not store a refernce to the instance itself to avoid circular referencing) */
    army;
    /**Id of the Faction instance the unit currently belongs to (do not store a refernce to the instance itself to avoid circular referencing) */
    position = { x: 0, y: 0 } //initial position where unit is located, for testing if there is existing army (will look at a different way to handle this)
    level = {
        current: 0,
        researched: 0,
        max: 0
    }
    faction = { name: "", id: "" }
    Base = {
        Speed: 0,
        Hitpoints: 0,
        ViewRange: 0,
        AttackRange: 0,
        Strength: {
            Attack: {},
            Defense: {}
        }
    };
    Cost = {
        Production: {},
        Upkeep: {},
        Research: {},
        Upgrade: {}
    }
    TerrainBonus = {}

    constructor(faction, level = "1") {
        Object.assign(this.Base.Strength.Attack, new Strength())
        Object.assign(this.Base.Strength.Defense, new Strength())
        Object.assign(this.Cost.Production, new Resources())
        Object.assign(this.Cost.Upkeep, new Resources())
        //Object.assign(this.Cost.Upgrade, new Resources())
        Object.assign(this.TerrainBonus, new TerrainSet)

        this.faction.name = faction.name;
        this.faction.id = faction.id;
        this.doctrine = faction.doctrine
        this.generateID(faction)
    }

    /**
     * @param { Number} x x co-ordinate
     * @param { Number} y y co-ordinate
     */
    setPosition(x, y) {
        this.position.current.x = x
        this.position.current.y = y
    }
    /**
     * @param { Faction } faction 
     */
    generateID(faction) {
        do { this.id = `${faction.id}-${Utility.generateAplhaString(5)}` }
        while (faction.$UNITS.has(this.id))
    }
    /**
     * Description placeholder
     *
     * @param {number} level
     * @property {object} currentData Represents the data
     */
    setStats(level) {
/*<<<TEST>>>*/ const LOCALTEST = false;
        this.level.current = level;
        const currentData = this.data[this.level.current];

/*<<<TEST>>>*/ LOCALTEST ? console.log(`Testing: Unit.setStats(${level})`) : null
        /*<<<TEST>>>*/ //LOCALTEST ? console.log("currentData: ", currentData) : null

        this.Base = {
            Speed: currentData.Speed,
            Hitpoints: currentData.Hitpoints,
            ViewRange: currentData.ViewRange,
            AttackRange: currentData.AttackRange,
            Strength: {
                Attack: currentData.Strength.Attack,
                Defense: currentData.Strength.Defense
            }
        }
        this.TerrainBonus = this.data.Terrain //NOTE: This is root level of unit, not for each level

        this.Cost = {
            Production: currentData.Cost.Production,
            Upkeep: currentData.Cost.Upkeep,
        }

        this.Cost.Production.Time = new Duration(this.Cost.Production.Time)
        this.Cost.Production.Time = this.Cost.Production.Time.toSeconds()
/*<<<TEST>>>*/ LOCALTEST ? console.log("Converted Production Time: ", this.Cost.Production.Time) : null

        this.applyDoctrineModifiers()
        //applyUnitModifiers()
        this.Current = this.Base
    }
    applyDoctrineModifiers() {
        const LOCALTEST = true;

        const Mod = $TYPE.DoctrineModifiers[this.doctrine.description]
        switch (this.doctrine) {
            case $TYPE.Doctrine.Axis:

                //Handle Multiprops
                this.applyModifierMulti({
                    "Base.Strength.Attack": Mod.Strength,
                    "Base.Strength.Defense": Mod.Strength,
                    "Cost.Production": Mod.ProductionCost
                }, "roundToPrecision")
                break;

            case $TYPE.Doctrine.Allies:

                this.Base.Speed = $MR.roundToMultiple(this.applyModifier(this.Base.Speed, Mod.Speed, "Speed"), 1)
                this.Cost.Production.Time = $MR.roundToMultiple(this.applyModifier(this.Cost.Production.Time, Mod.ProductionTime, "Production Time"), 1)
                //NOTE: Research and Upgrade modifiers are applied in different places

                break;

            case $TYPE.Doctrine.Comintern:

                this.applyModifierMulti({
                    "Base.Strength.Attack": Mod.Strength,   // Strength: 0.90
                    "Base.Strength.Defense": Mod.Strength,  // Strength: 0.90
                    "Cost.Production": Mod.ProductionCost,  // ProductionCost: 0.85,
                }, "roundToPrecision")

                this.applyModifierMulti({ "Cost.Upkeep": Mod.UpkeepCost }, "roundToMultiple") // UpkeepCost: 0.70,
                break;

            case $TYPE.Doctrine.Panasia:

                this.Base.Hitpoints = $MR.roundToMultiple(this.applyModifier(this.Base.Hitpoints, Mod.Hitpoints, "Hitpoints"), 1)   // Hitpoints: 0.90
                this.Base.Speed = $MR.roundToMultiple(this.applyModifier(this.Base.Speed, Mod.Speed, "Speed"), 1)                   // Speed: 1.20,
                this.Base.ViewRange = $MR.roundToMultiple(this.applyModifier(this.Base.ViewRange, Mod.ViewRange, "ViewRange"), 1)   // ViewRange: 1.30,
                this.applyModifierMulti({ "TerrainBonus.Speed": Mod.TerrainBonus, "TerrainBonus.Strength": Mod.TerrainBonus }, "roundToPrecision", 2, "+") // TerrainBonus: 0.20

                break;
        }
    }
    applyModifier(property, modifier, description = "Value", rounding = "roundToMultiple", roundTo = 1, operator = "*") {
        const LOCALTEST = true
        let modifiedValue;
        switch (operator) {
            case "+":
                if (property > 1) { modifiedValue = $MR[rounding](property + modifier, roundTo) }
                else { modifiedValue = property }
                break;
            default:
                modifiedValue = $MR[rounding]((property * modifier), roundTo)
                break;
        }

/*<<<TEST>>>*/  LOCALTEST ? console.log(`${description} before: `, property) : null
/*<<<TEST>>>*/  LOCALTEST ? console.log(`${description} after: `, modifiedValue) : null
        return modifiedValue
    }

    applyModifierMulti(properties, rounding = "roundToMultiple", roundTo = 1, operator = "*") {
/*<<<TEST>>>*/  const LOCALTEST = false
        Object.entries(properties).forEach(([prop, mod]) => {
/*<<<TEST>>>*/  LOCALTEST ? console.log("Properties: ", properties) : null
/*<<<TEST>>>*/  LOCALTEST ? console.log("Prop: ", prop, " Mod: ", mod) : null
            let $PROP = Utility.getNestedProperty(this, prop)
            Object.keys($PROP).forEach(key => {
                if (/*key !== "Time" &&*/ typeof $PROP[key] === "number") {
                    $PROP[key] = this.applyModifier($PROP[key], mod, key, rounding, roundTo, operator)
                }
            })
        })

    }

    setArmy(faction) {
        let ARMY;

        if (faction.$ARMIES.size > 0) {
            faction.$ARMIES.forEach((ArmyInstance, ArmyId) => {
                if (ArmyInstance && ArmyInstance.isAtLocation({ x: this.position.x, y: this.position.y })) {
                    ARMY = ArmyInstance;
                    this.army = ArmyId;
                }
            });
        }

        if (!this.army) { //if this.army is still blank, create a new army
            ARMY = new Army(faction)
            this.army = ARMY.id
        }
        ARMY.addUnit(this)  //add this unit to the army
    }
    updateHitpoints() {
        //updateSpeed() as it could be reduced (or increased) when hp reaches a certain threshold
        //updatestrength() as it could be reduced (or increased) when hp reaches a certain threshold
    }

    /**
     * Used to update current speed stat, either when in different terrain, or damage has reached a certain threshold
     *
     * @param {!Number} [newSpeed]
     */
    updateSpeed(newSpeed) {

    }
    updateStrength() {

    }
}
/**@extends Unit */
class Militia extends Unit {
    class = $TYPE.UnitClass.Unarmored;
    constructor(faction, level = 1, data = UnitData.Militia) {
        super(faction, level);
        this.data = data;
        this.setStats(level)

    }
}

class Infantry extends Unit {
    class = $TYPE.UnitClass.Unarmored;
    constructor(data /* = */) { super(data); }
}

class MotorizedInfantry extends Unit {
    class = $TYPE.UnitClass.Unarmored;
    constructor(data /* = */) { super(data); }
}

class MechanizedInfantry extends Unit {
    class = $TYPE.UnitClass.Light;
    constructor(data /* = */) { super(data); }
}

class Commando extends Unit {
    class = $TYPE.UnitClass.Unarmored;
    constructor(data /* = */) { super(data); }
}

class Paratrooper extends Unit {
    class = $TYPE.UnitClass.Unarmored;
    constructor(data /* = */) { super(data); }
}

/*====================EXPORTS=============================*/

exports.Units = {
    Unit, Militia, Infantry, MotorizedInfantry, MechanizedInfantry, Commando, Paratrooper
}


if (thisModule.TEST_MODE) { /*???????????????????????????????????????? TESTS ????????????????????????????????????????*/
    thisModule.logTestStart();
    //--------------- Tests Below: ---------------------------------
    const { Faction } = require('./faction');
    let faction = new Faction("Test Faction", $TYPE.Doctrine.Panasia)
    console.log("Faction Name: ", faction.name)
    console.log("Faction Doctrine: ", faction.doctrine.description)
    console.log("Faction ID: ", faction.id)


    let unit1 = new Militia(faction, 1);
    console.log("Class: ", unit1.class.description)
    console.log("Class matches Symbol?:", unit1.class === $TYPE.UnitClass.Unarmored)
    console.log("Unit1 Doctrine: ", unit1.doctrine.description)
    console.log("Unit ID: ", unit1.id)

    //console.log(unit1.Base)
    //console.log(unit1.Current)

    //console.log(unit1)


}


