const moduleName = "Unit"
console.log(`Loading Module: ${moduleName}`)

const $TYPE = require('C:/Users/foste/OneDrive/Repos/CowHelper/src/model/globals')
const inputType = $TYPE.DurationInputType




/**
 * Main property of Duration class. Stores the days, hours, minutes and seconds as 
 * separate properties so they can be easily manipulated into various forms
 * by the methods of the Duration class. 
 * Optional: seconds don't need to be included
 * @typedef {object} time
 * @property { number | string } days
 * @property { number | string } hours
 * @property { number | string } minutes
 * @property { ?number | ?string } [seconds]
 */

/**
 * Creates a new instance of a custom Time object to represent a duration or countdown.
 * Typically used to represent the amount of time it will take to produce, build, research, or move a game element, or other combat related timers.
 * 
 * Seperate from vanilla Date/Time objects that represent a certain calendar/clock object.
 */
class Duration {
    /**@type { time } */
    time = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    /**
     * @param {Array.<Number> | String | object} inputTime The data to be transformed into 
     * @param {String=} [seperator] - Accepts ":" (default) or "alpha" to indicate alpha-character seperators
     * 
    * Valid forms: Array [Day(s), hour(s), minute(s), second(s)]. If only 3 entries present, seconds will not be included. Any less and validator will reject and throw an error. 
    * a String with seperators as either D:h:m:s or #d#h#m#s. As above, seconds will be 
    *  @example 1 day, 12 hours, 45 minutes, 30 seconds
    *  Array [1,12,45,30]
    * String (":") "1:12:45:30"
    * String  ("alpha") "1d12h45m30s"
     */
    constructor(inputTime) {
        this.transformInput(inputTime)
    }
    /**
     * @description Some description. Also add that it should include validation
     * @param {Array.<Number> | String | object} inputTime The same input from the constructor, can be in various forms
     * @returns {object} inputType - string indicating the detected format of time input
     */
    transformInput(inputTime) {
        let timeArray = [];
        let regex = {
            default: new RegExp("([0-9]{1,2})(:[0-9]{1,2}){2}(:[0-9]{1,2})?"),
            alpha: new RegExp("/(([0-9]{1,2})[d])(([0-9]{1,2})[h])(([0-9]{1,2})[m])(([0-9]{1,2})[s])?/i")
        }

        if (Array.isArray(inputTime) && inputTime.length <= 4 && inputTime.length > 0){
                //check contents is number or string
                timeArray = inputTime;
        }
        if ( typeof inputTime === "string" && inputTime.includes(":") && regex.default.test(inputTime) ){
            timeArray = inputTime.split(":");
        }
        if ( typeof inputTime === "string" && regex.alpha.test(inputTime) ){
            console.log("I don't know how to split this yet")
        }
        if( typeof inputTime === "object" && !Array.isArray(inputTime) ){
            for (const [key, value] of Object.entries(inputTime)) {
                this[key.toLowerCase()] = parseInt(value);
              }
        }              

        if (timeArray.length > 0) {
            this.time.days = parseInt(timeArray[0]);
            this.time.hours = parseInt(timeArray[1]);
            this.time.minutes = parseInt(timeArray[2]);
            timeArray[3] ? this.time.seconds = parseInt(timeArray[3]) : this.time.seconds = 0;
        }

    }
    toHours() {
        return this.time.days * 24 + this.time.hours
    }
    toMinutes() {
        console.log(`Duration.toMinutes(${this.days * 1440 + this.hours * 60 + this.minutes})`);
        return this.time.days * 1440 + this.time.hours * 60 + this.time.minutes
    }
    toSeconds() {
        return this.time.days * 86400 + this.time.hours * 3600 + this.time.minutes * 60 + this.time.seconds;
    }
    /**
     * 
     * @param {*} format - enum of $InputType to determine the structure of the output string
     * @returns {string}
     */
    toText(format) {
        switch (format) {
            //add the other formats
            case $InputType.Alpha.description:
                //add seconds?
                return `${this.time.days}d ${this.time.hours}h ${this.time.minutes}m`
            case $InputType.Default.description:
                //add seconds?
                return `${this.time.days}:${this.time.hours}:${this.time.minutes}`
        }
    }
}

// let testTime = new Duration("01:12:45:30")
// console.log(testTime)
// console.log(testTime.toSeconds())


exports.Duration = Duration;