/**@module Army*/
//Includes references to Faction instance, and Unit instances, but does not require the modules (at this point)
const { ModuleUtils } = require('../middleware/utility/utility');
let thisModule = new ModuleUtils("Army")
thisModule.logLoad;
thisModule.TEST_MODE = false;
//========================================================================================================


/**
 * Importing the globals enums - only needs Branch at this stage, but leaving non-destructured incase other globals are needed  
 *  @example  
 * - const { Branch } = require('./globals')  
 * - const $TYPE = require('./globals')
 * @requires module:CowHelper/globals~Branch  
 * 
 * 
 * Access with $TYPE.Branch.[BranchType]:
 * @example $TYPE.Branch.Air, $TYPE.Branch.Army, $TYPE.Branch.Navy
 */
const $TYPE = require('./globals');
const { Strengths } = require('./stats');
const { duration, Duration } = require('./time');

/**
 * Represents a "stack" of units, and is kind of a "wrapper" or grouping of Units.
 * It can be a single unit, and must contain at least one instance of Unit class.
 * Created from within the Unit class itself, when it detects no other Army it is eligible to join in it's location.
 * @requires module:CowHelper/globals~Branch
 */
class Army {
    /**
     * Suffix of army unit names, taken from the CoW game. Specific to army type (as defined by "Branch") and by size (number of units):  
     * 
     * - Army (Infantry): Brigade(1), Regiment(2), Division(3+)  
     * - Army (Motorized or Mixed): Brigade(1-2), Division(3+)  
     * - Navy (no Captiol Ship ie BB) Squadron(1-2), Flotilla(3+)  
     * - Navy (with Capitiol Ship) Group(1-2), Flotilla(3+)  
     * - Airforce: Squadron(1-2), Wing(3+)  
     *
     * @static
     * @example "64th Armoured Division", "40th Medium Tank Division", "31st Tactical Bomber Wing", "2nd Battleship Flotilla"
     */
    static $NAMES = {
        Army: new Set(["Brigade", "Regiment", "Division"]),
        Navy: new Set(["Group", "Squadron", "Flotilla"]),
        Air: new Set(["Squadron", "Wing"])
    }

    /** A map of Unit instances that make up an Army instance. */
    $UNITS = new Map();
    /**Unit with the highest strength value, determines what sprite to use as Army image */
    leader;

    /** 
     * The military branch this Army belongs to. Used to determine it's name, units that can be added and terrain it can move across
     * @type {$TYPE#Branch} Uses values from globals enum Branch.
     * @example $TYPE.Branch.Air, $TYPE.Branch.Army, $TYPE.Branch.Navy
    */
    branch;

    /**
     * State tracking for combat related states
     * @property { boolean } canAttack Whether the Army is eligible to initiate a new round of combat. Usually false when Combat Timer is still counting down.
     * @property { boolean } isAttacking
     * @property { boolean } isDefending
     * @property { number } combatTimer Remaining time before new combat round can start (in seconds). Default 30 mins (1800)
     */
    combatStates = {
        combatTimer: {
            default: 1800,
            remaining: 1800,
            onCooldown: false
        },
        canAttack: true,
        isAttacking: false,
        isDefending: false,
    }
    updateCombatTimer() {
        if (this.combatStates.isAttacking && this.combatStates.combatTimer.onCooldown) {
            if (combatTimer > 0) {
                canAttack = false;
            }
        }
        if (combatTimer <= 0) {
            canAttack = true;
            onCooldown = false;
            combatTimer.remaining = combatTimer.default;
        }
    }

    /**
     * Object containing location and movement information. Used for comparing locations with other Armies, 
     *
     * @type {{ ismoving: boolean; current: { x: number; y: number; }; target: { x: number | null; y: number | null; }; }}
     */
    position = {
        ismoving: false,
        current: { x: 0, y: 0 },
        target: { x: null, y: null }
    }

    /**
     * Summation of the base stats of all the units that are part of the Army.  
     * Doesn't neccessarily reflect the current values of the army, but the baseline if all units where at 100% health, with no other modifiers affecting them.  
     * Strength (Attack & Defense) ommitted, as will be recalculated as calculated "Damage Potential" depending on number/type of units  
     *  
     * - speed: the lowest speed value of all units
     * - hp: sum total of hitpoints for all units
     * - viewrange: highest viewrange value of all units
     *
     * @type {{ speed: number; hp: number; viewrange: number; attackrange: number; }}
     */
    stats = {
        base: {
            speed: 0,
            hp: 0,
            viewrange: 0,
            attackrange: 0
        },
        current: {
            hp,
            speed
        }
    }

    /**
     * @param {Faction} faction
     */
    constructor(faction) {
        try { //add error handling here. MUST have Faction
            if (faction === undefined || faction.constructor.name !== "Faction") {
                throw new Error("Faction not defined or is not Faction class")
            } else {
                this.faction = faction.name;
                eventEmitter.on('globalTick', this.updateCombatTimer.bind(this));
                this.createID(faction)

                //do more validation here before committing to Faction list??
                //if (this.$UNITS.size > 0)
                faction.$ARMIES.set(this.id, this)
            }
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Assign a number to the army as part of it's name/id. Starting from 1, loops through all
     * existing Army instances, until it finds the next unused number
     * (Unused, because as an Army is destroyed, it's number is removed)
     *
     * @param {Faction} faction
     */
    createID(faction) {

        let i = 1;
        do {
            this.id = `${faction.id}-${i}`
            i++
        }
        while (faction.$ARMIES.has(this.id))
    }

    /**
     * Description placeholder
     *
     * @returns {string}
     * @example "64th Armoured Division", "40th Medium Tank Division", "31st Tactical Bomber Wing", "2nd Battleship Flotilla"
     */
    determineGroup() {
        let group = ""
        switch (this.branch) {
            case $TYPE.Branch.Airforce:
                if (this.$UNITS.size < 3 && this.$UNITS.size > 0) {
                    group = Army.$NAMES.Air[0] //"Squadron"
                } else {
                    group = Army.$NAMES.Air[1] //"Wing"
                }
                break;
            case $TYPE.Branch.Army.Infantry:
                if (this.$UNITS.size < 3) {
                    group = Army.$NAMES.Army[1] //Regiment
                } else {
                    group = Army.$NAMES.Army[2] //Division
                }
                break;
            case $TYPE.Branch.Army.Motorized || $TYPE.Branch.Army.Mixed:
                if (this.$UNITS.size < 3) {
                    group = Army.$NAMES.Army[0] //Brigade
                } else {
                    group = Army.$NAMES.Army[2] //Division
                }
                break;
            case $TYPE.Branch.Navy:
                if (this.$UNITS.size < 3) {
                    //if has captiol ship
                } else {
                    group = Army.$NAMES.Navy[3] //Flotilla
                }
                break;
        }
        return group
    }
    /**
     * Typically called by an instance of Unit class, as part of a loop through all existing Armies belonging to the
     * owning faction, to determine if there is an existing Army at it's location that it can join, or whether a new
     * one needs to be created
     * 
     * @param {object} position Object contain x & y co-ordinates of the target location to check against this Army
     * @param {number} position.x the x-axis position
     * @param {number} position.y the y-axis position
     * @returns {boolean} Returns true when the x & y co-ordinates of this Army's current (this.current.position.x/y) match the supplied target x/y co-ordinates
     */
    isAtLocation(position) {
        if (this.current.position.x === position.x
            && this.current.position.y === position.y) {
            return true
        } else { return false }
    }

    set moveTo(target) {
        //check if valid move order?
        isMoving = true;
        this.target = target;
    }

    set stopped(position) {
        isMoving = false;
        this.target.x = null;
        this.target.y = null;
        this.position = position
    }
    combineArmy(army) {
        //for each unit in old army - add unit to this army

        //remove units from old army
        //remove old army from Faction register

    }
    /**
     * Determine whether unit type belongs to the same Branch as this Army and can be added  
     * ie Infantry(Army) in the same position as an Airforce Army cannot be added
     * @param {Unit} unit reference to the Unit instance that will potentially be added to this Army
     * @returns {boolean} true or false, depending on whether the unit type matches the branch type of this Army
     */
    isSameBranch(unit) {
        let bool;

        return bool
    }
    addUnit(unit) {
        this.$UNITS.set(unit.id, unit);
        this.updateArmy();
    }
    updateArmy() {
        //re-calculate name suffix
        //re-calculate damage potential
        //re-calculate class distribution
    }

    removeUnit(unit) {

    }
    calculateClassDistribution() {
        this.classCount = new Strengths()
        this.classDistribution = new Strengths()
        //For every Unit in this Army, get the values
        this.$UNITS.forEach((UnitInstance, UnitID)=>{
            //And for every property of the UnitClass enum
            this.classCount["Class Count: ", UnitInstance.class.description] ++
            
        })
        console.log(this.classCount)
        
        Object.entries(this.classCount).forEach(([Key, Value])=>{
            this.classDistribution[Key] = Math.round((Value / this.$UNITS) *100)
        })
        console.log("Class Distribution: ", this.classDistribution)
        //was thinking to sum the amount of units in each class to work out the percentage, which is fine for "Class Distribution", but maybe
        //not so useful for calculating damage output based on "top 10 strongest units"


    }
    calculateDamagePotential(terrain) {
        this.$UNITS.forEach((unitData, unitID) => {
            //unitData.class
        })
        //multiplying the base damage values of the unit type with the unit amount
        //the terrain modifiers, 
        //the home defence bonus and the 
        //damage efficiency (see section below).

    }

}

exports.army = Army

//For the attacking army its attack damage potential against all armor classes is calculated.
//For the defending army its defence damage potential against all armor classes is calculated.

// The damage potential is calculated by multiplying the base damage values of the unit type with the unit amount,

// The Terrain bonus influences the damage potential of a unit type. Each unit type has different terrain bonuses, which can be seen in the unit details panel (click on unit icon in army interface).
// The Home Defence bonus influences the damage potential as well. It grants a 15% bonus in damage potential to armies which are located in a core province of their own nation, in addition to a 15% bonus in damage reduction.