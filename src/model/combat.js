console.log("Loading Module: Combat")

const { Army } = require("./army");
const { Territory } = require("./territory");

class Combat{
    Attacker = {
        DamagePotential: {
            Unarmored: 0,
            Light: 0,
            Heavy: 0,
            Air: 0,
            Ship: 0,
            Sub: 0,
            Building: 0,
            Morale: 0
        }
    }

    /**
     * Instance of combat between two opposing armies.
     *
     * @constructor
     * @param {Army} attacker Instance of Army that initiates the combat
     * @param {Army} defender Instance of Army the had the combat initiated against
     * @param {Territory} territory The territory where the two armies have met. Primarily used to calculate strength modifiers
     */
    constructor(attacker, defender, territory){

    }
    // Sum up the damage potential of the army against each armor class. (.forEach() armor class - top 10 units for each class?)

    // Increase or reduce damage value with a random factor between -20% and +20%. (setRandomDamageFactor)
    
    /**
     * Description placeholder
     *
     * @returns {number} modifier 
     */
    setRandomDamageFactor() {
        const min = Math.ceil(-20);
        const max = Math.floor(20);
        return Math.floor(Math.random() * (max - min + 1) + min) / 100; // The maximum is 
    }
}

// The combat calculation always follows these steps:


// Lower the damage potential based on the army's damage efficiency (Based on HP - this is already done at a per-unit level)
// Deal out damage value to enemy army (the order depends on the combat type).
// Reduce the received damage value based on the enemy army's protection value.
// Distribute reduced damage value to units in enemy army based on army composition.
// Reduce hitpoints of units or destroy units based on amount of distributed damage.

// To try explain it another way:
// See the formula: X * 0.8 + 20
// The result of this calculation is the damage efficiency. X is the health percentage so if I'm at half health it's 50.
//(unitHealthPercentage) * 0.8 + minimum

// Correction on this: You don't divide by the number of units in the army, but multiply by the percentage share of units of that armor class.
// So in your example the tank would receive 33% of the attack damage vs. armored (12 * 0.33 = 4), while the Infantry would receive 66% of the attack damage vs. unarmored (6 * 0.66 = 4).

// The game calculates that percentage share for you, just open the army info panel of the enemy army and look it up in the "damage distribution" column. Multiply those values with your own army's "damage potential" values against these armor classes.

//When planes attack they lose HP from the defenders before their damage efficiency is calculated.
//For example, it is possible to shoot down planes before they can attack.
//This can be demonstrated by attacking a bunch of anti air with a plane.
//If the anti air defensive damage is more than the HP of the plane, the plane can't attack and the anti air will lose zero HP.