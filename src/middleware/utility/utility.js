
/**
 * Select a random value from an Object{} set (not array or similar "object" type)  
 * Will only take keys/values from the first level. Generally used for "enum" objects in "globals.js"
 *
 * @param {object} obj The object containing values to select from
 * @returns {*}
 * @example selects one value from:
 * const Resource = Object.freeze({
    Food: Symbol("Food", {constant: true}),
    Metal: Symbol("Metal", {constant: true}),
    Oil: Symbol("Oil", {constant: true}),
    Goods: Symbol("Goods", {constant: true}),
    Rare: Symbol("Rare", {constant: true}),
    Manpower: Symbol("Manpower", {constant: true}),
    Warbonds: Symbol("Warbonds", {constant: true})
        })
 */
function getRandomObjectValue(obj){
    var keys = Object.keys(obj);

    return obj[keys[ keys.length * Math.random() << 0]];
}

/**
 * Generate a randomised set of alpha characters of requested length (default 2), from a set of characters. Used for creating unique IDs.  
 * Default: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
 * @function
 * @param {number} [length=2] Number of characters to be returned in string (Default = 2)
 * @param {string} [optionSet] (Optional) Custom set of characters if needed, otherwise all alphabet characters included
 * @param {boolean} [lowercase=false] (Optional) Convert character set to lower case (Default: false)
 * @returns {string}
 */
function generateAplhaString(length = 2, optionSet, lowercase = false ) {
    const characters = optionSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase){characters = characters.toLowerCase()}
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

class ModuleUtils{
    constructor(moduleName){
        this.name = moduleName
        this.TEST_MODE = false
    }
    logLoad(){
        console.log(`Loading Module: ${this.name}`)
    }
    logTestStart(){
        console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<< [ TEST MODE ] Module: ${this.name} >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
    }
}
function getNestedProperty(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
  
  function setNestedProperty(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => acc && acc[part], obj);
    if (target) {
      target[last] = value;
    }
  }
  
module.exports = {
    getRandomObjectValue,
    generateAplhaString,
    ModuleUtils,
    getNestedProperty,
    setNestedProperty
}