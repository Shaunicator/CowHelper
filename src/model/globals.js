/**
 * @module globals
 * A collection of read-only objects representing different items and concepts
 * Used for keeping consistency of reference to the constants
 * Generally called into other modules as parent object as {@type {$TYPE}}
 * @example const $TYPE = require('../model/globals')
 * @memberof CowHelper
 */

/**
 * @typedef {object.<string,symbol>} $TYPE
 * @readonly
 */

const Territory = Object.freeze({
    Territory: Symbol("Territory", {constant: true}),
    Rural: Symbol("Rural", {constant: true}),
    City: Symbol("City", {constant: true})
})

const Resource = Object.freeze({
    Food: Symbol("Food", {constant: true}),
    Metal: Symbol("Metal", {constant: true}),
    Oil: Symbol("Oil", {constant: true}),
    Goods: Symbol("Goods", {constant: true}),
    Rare: Symbol("Rare", {constant: true}),
    Manpower: Symbol("Manpower", {constant: true}),
    Warbonds: ("Warbonds", {constant: true})
})

const Terrain = Object.freeze({
    Plains: Symbol("Plains", {constant: true}),
    Forest: Symbol("Forest", {constant: true}),
    Hills: Symbol("Hills", {constant: true}),
    Mountains: Symbol("Mountains", {constant: true}),
    Urban: Symbol("Urban", {constant: true}),
    Sea: Symbol("Sea", {constant: true}),
})

const Buildings = Object.freeze({
    AircraftFactory: Symbol("Aircraft Factory", {constant: true}),
    Industry: Symbol("Industry", {constant: true}),
    LocalIndustry: Symbol("Local Industry", {constant: true}),
    RecruitingStation: Symbol("Recruiting Station", {constant: true})
})

const UnitClass = Object.freeze({
    Unarmored: Symbol("Unarmored", {constant: true}),
    Light: Symbol("Light", {constant: true}),
    Heavy: Symbol("Heavy", {constant: true}),
    Air: Symbol("Air", {constant: true}),
    Ship: Symbol("Ship", {constant: true}),
    Sub: Symbol("Sub", {constant: true}),
})

const DurationInputType = Object.freeze({
    Array: Symbol("array", {constant: true}),
    Default: Symbol("default", {constant: true}),
    Alpha: Symbol("alpha", {constant: true}),
    Object: Symbol("object", {constant: true}),
    Unknown: Symbol("Unknown", {constant: true})
})

const Branch = Object.freeze({
    Army: {
        Infantry: Symbol("Infantry", {constant: true}),
        Motorized: Symbol("Motorized", {constant: true}),
        Mixed: Symbol("Mixed", {constant: true})
    },
    Navy: Symbol("Navy", {constant: true}),
    Airforce: Symbol("Airforce", {constant: true})
})

const Doctrine = Object.freeze({
    Axis: Symbol("Axis", {constant: true}),
    Allies: Symbol("Allies", {constant: true}),
    Comintern: Symbol("Comintern", {constant: true}),
    Panasia: Symbol("Panasia", {constant: true})
})

const DoctrineModifiers = Object.freeze({
    Axis: {
        Hitpoints: 1.15,
        Strength: 1.15,
        ProductionCost: 1.10
    },
    Allies: {
        Speed: 0.90,
        ProductionTime: 0.70,
        ResearchCost: 0.75,
        ResearchTime: 0.75,
        UpgradeCost: 0.80
    },
    Comintern: {
        ProductionCost: 0.85,
        UpkeepCost: 0.70,
        Strength: 0.90
    },
    Panasia: {
        Speed: 1.20,
        ViewRange: 1.30,
        TerrainBonus: 0.20,
        Hitpoints: 0.90
    }
})

module.exports = { Territory, Resource, Terrain, Buildings, UnitClass, DurationInputType, Branch, Doctrine, DoctrineModifiers }