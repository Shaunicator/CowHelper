//import * as $MR from 'more-rounding';
const $MR = require('more-rounding');
const { Duration } = require('../../public/utility/model-time.js')
const data = {};
data.units = require('../data/units.json')
//import unitDataFile from '../data/unitData.json' with { type: "json" };


const getUnitData = (request, response) => {

    const unit = request.params.unit
    let calculatedUnit;
    console.log(`>>> REQ: GET UnitData(${unit})`);
    if (request.params.doctrine) {
        console.log(">>> Doctrine: ", request.params.doctrine)
        if (data.units[unit]) {
            calculatedUnit = calculateUnitData(data.units[unit], request.params.doctrine)
        }
    } else {
        response = null;
    }

    response.json(calculatedUnit);
}

const getUnitData_ALL = (request, response) => {
    console.log("Get All Data");
    response.json(data.units);
}

function calculateUnitData(unitData, doctrine) {
    console.log("+ + + Start calculateUnitData() + + +")


    const newData = DoctrineModifiers[doctrine](unitData);
    //unit specific modifiers (also based on doctrine)

    return newData;


}
/**
 * Set of methods with specific modifiers for each Doctrine.
 * @param {Object<Object>}unitData - An object from JSON data containing all data for all levels of one unit Type.
 * @returns An updated data object.
 */
const DoctrineModifiers = {
    Axis: function (unitData) {
        console.log("Starting Axis calculations...")
        const mods = {
            hp: 1.15,
            damage: 1.15,
            prodCost: 1.10
        }
        //Parse and stringify input unit Object to retain copy of data while removing prototype(?) links
        let _$unitData = JSON.parse(JSON.stringify(unitData));
        const $Levels = Object.getOwnPropertyNames(_$unitData)

        $Levels.forEach($L => {
            _$unitData[$L].Hitpoints = $MR.roundToMultiple(_$unitData[$L].Hitpoints * mods.hp, 1)
            console.log(`Hitpoints Level ${$L}: ${unitData[$L].Hitpoints} => ${_$unitData[$L].Hitpoints}`)

            const $Attack = Object.getOwnPropertyNames(_$unitData[$L].Strength.Attack)
            $Attack.forEach($class => {

                _$unitData[$L].Strength.Attack[$class] = $MR.roundToPrecision(_$unitData[$L].Strength.Attack[$class] * mods.damage, 1);
                //console.log(`Attack Level ${$L}-${$class}: ${unitData[$L].Strength.Attack[$class]} => ${_$unitData[$L].Strength.Attack[$class]}`)
            })

            const $Defense = Object.getOwnPropertyNames(_$unitData[$L].Strength.Defense)
            $Defense.forEach($class => {
                _$unitData[$L].Strength.Defense[$class] = $MR.roundToPrecision(_$unitData[$L].Strength.Defense[$class] * mods.damage, 1, "up");
                //console.log(`Defense Level ${$L}-${$class}: ${unitData[$L].Strength.Defense[$class]} => ${_$unitData[$L].Strength.Defense[$class]}`)
            })

            const $ProductionCost = Object.getOwnPropertyNames(_$unitData[$L].Cost.Production)
            $ProductionCost.forEach($resource => {


                if (_$unitData[$L].Cost.Production[$resource] !== "-") {
                    if ($resource === "Time") {
                        // console.log(_$unitData[$L].Cost.Production[$resource])
                        _$unitData[$L].Cost.Production[$resource] = new Duration(_$unitData[$L].Cost.Production[$resource].split(":"));
                        // console.log(_$unitData[$L].Cost.Production[$resource])
                    } else {
                        _$unitData[$L].Cost.Production[$resource] = $MR.roundToPrecision(_$unitData[$L].Cost.Production[$resource] * mods.prodCost, -1, "up");
                        console.log(`Prod Cost ${$L}-${$resource}: ${unitData[$L].Cost.Production[$resource]} => ${_$unitData[$L].Cost.Production[$resource]}`)
                    }
                }
            })
        })
        console.log("Pre Upgrade Unit Data: ")
        calculateUpgrade(_$unitData);

        return _$unitData;
    },
    Allies: function (unitData) {
        console.log("Starting Allies calculations...")
        const mods = {
            speed: 0.90,
            prodTime: 0.70,
            researchCost: 0.75,
            researchTime: 0.75,
            upgradeCost: 0.80
        }
        //Parse and stringify input unit Object to retain copy of data while removing prototype(?) links
        let _$unitData = JSON.parse(JSON.stringify(unitData));
        //Get an array list of all available levels for this specific unit
        const $Levels = Object.getOwnPropertyNames(_$unitData);

        $Levels.forEach($L => {
            //Update with improved Move Speed
            console.log(`*************** Level ${$L}******************** `)
            _$unitData[$L].Speed = $MR.roundToMultiple(_$unitData[$L].Speed * mods.speed, 1)
            //console.log(`Speed Level ${$L}: ${unitData[$L].Speed} => ${_$unitData[$L].Speed}`)

            //Improve Production Time //Improve Research Time
            const items = ["Production", "Research"];
            items.forEach(i => {
                console.log(`Pre ${i} Time: `, _$unitData[$L].Cost[i].Time);
                _$unitData[$L].Cost[i].Time = new Duration(_$unitData[$L].Cost[i].Time.split(":"));
                console.log("Duration: ", _$unitData[$L].Cost[i].Time)
                _$unitData[$L].Cost[i].Time =
                    _$unitData[$L].Cost[i].Time.minutesToTime(
                        _$unitData[$L].Cost[i].Time.toMinutes() * mods.prodTime)

                console.log(`New ${i} Time: `, _$unitData[$L].Cost[i].Time);
            })


            //Improve Research Cost


        })


        calculateUpgrade(_$unitData);
        return _$unitData
    },
    Comintern: {
        ProductionCost: 0.85,
        UpkeepCost: 0.70,
        Strength: 0.90
    },
    Panasia: {
        MoveSpeed: 1.20,
        ViewRange: 1.30,
        TerrainBonus: 1.20,
        Hitpoints: 0.90
    }
}
function calculateUpgrade(unitData) {
    const $Levels = Object.getOwnPropertyNames(unitData)
    const upgradeMod = 0.5;

    $Levels.forEach($L => {
        console.log("Level: ", $L)
        if ($L != "1") { //No upgrade available for Level 1 so skip
            //Get a list of all of the resources from the existing Production property
            const rList = Object.getOwnPropertyNames(unitData[$L].Cost.Production);
            //If the Upgrade property has not been added, add a blank object
            unitData[$L].Cost.Upgrade = unitData[$L].Cost.Upgrade || {};

            //For every resource, calculate the upgrade cost
            rList.forEach(r => {
                //If the resource is not a property (likely due to Upgrade not being a parent property), 
                //add the property with a zero value
                unitData[$L].Cost.Upgrade[r] = unitData[$L].Cost.Upgrade[r] || 0

                if (r === "Time") { //if current Resource selected is "Time"
                    console.log("Prod Time: ", unitData[$L].Cost.Production.Time);

                    if (!unitData[$L].Cost.Production.Time instanceof Duration) {
                        //console.log("NOT DURATION")
                        unitData[$L].Cost.Upgrade.Time = new Duration(unitData[$L].Cost.Production.Time.split(":"));
                        console.log("Duration: ", unitData[$L].Cost.Upgrade.Time)
                    } else {
                        // let timeString = unitData[$L].Cost.Production.Time.toText(":").split(":");
                        // console.log("Time String: ", timeString);
                        unitData[$L].Cost.Upgrade.Time = new Duration((unitData[$L].Cost.Production.Time.toText(":")).split(":"));
                        console.log("Upgrade Time BEFORE: ", unitData[$L].Cost.Upgrade.Time)
                    }
                    unitData[$L].Cost.Upgrade.Time =
                        unitData[$L].Cost.Upgrade.Time.minutesToTime(
                            unitData[$L].Cost.Upgrade.Time.toMinutes() * upgradeMod)

                    console.log("Upgrade Time: ", unitData[$L].Cost.Upgrade.Time);

                } else if (unitData[$L].Cost.Production[r] !== "-" || parseInt(unitData[$L].Cost.Production[r]) === 0) {
                    console.log("Calculating resource...")
                    console.log(`Production: L${$L} - ${r}: \t`, unitData[$L].Cost.Production[r])
                    unitData[$L].Cost.Upgrade[r] = $MR.round(parseInt(unitData[$L].Cost.Production[r]) * upgradeMod);
                    console.log(`Upgrade: L${$L} - ${r}: \t`, unitData[$L].Cost.Upgrade[r])
                }
            }
            )
        }
    })
}

module.exports = { getUnitData, getUnitData_ALL };