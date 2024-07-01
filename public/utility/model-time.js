

export class Duration {
    /** 
     * @param {Array<Number>|String} time Either an array in days,hours,minutes,seconds(?), or a string in d:h:m:s?, or 0d0h0m0s?
     * @param {string} strFormat Indicator of how string has been split, ":" or "a"
    */
    constructor(time=[0,0,0,0], strFormat=":") {
        if (typeof time === "object"){
            this.days = parseInt(time[0]);
            this.hours = parseInt(time[1]);
            this.minutes = parseInt(time[2]);
            time[3] ? this.seconds= parseInt(time[3]) : this.seconds = 0;
        }

        
    }
    toHours() {
        return this.days * 24 + this.hours
    }
    toMinutes() {
        console.log(`Duration.toMinutes(${this.days * 1440 + this.hours * 60 + this.minutes})`);
        return this.days * 1440 + this.hours * 60 + this.minutes
    }
    toSeconds() {
        return this.days * 86400 + this.hours * 3600 + this.minutes * 60 + this.seconds;
    }
    toText(format) {
        switch (format) {
            case "t":
                return `${this.days}d ${this.hours}h ${this.minutes}m`
            case ":":
                return`${this.days}:${this.hours}:${this.minutes}`
        }

    }
    fromText(timeString, format = ":") {
        console.log(`Starting Duration.fromText(${timeString}`);
        if (format === ":") {
            let timeValues = timeString.split(":")
                this.days = parseInt(timeValues[0]);
                this.hours = timeValues[1];
                this.minutes = timeValues[2];

                if (timeValues[3]) {
                    this.seconds = timeValues[3];
                }
            }
    }
    minutesToTime(input) {
        // console.log(`Duration.minutesToTime(${input})`)
        //     console.log("===== Before =====")
        //     console.log("Days: \t", this.days);
        //     console.log("Hours: \t", this.hours);
        //     console.log("Minutes: \t", this.minutes);
        this.days = Math.floor(input / (24 * 60));
        const remainingMinutes = input - this.days * 24 * 60;
        this.hours = Math.floor(remainingMinutes / 60);
        this.minutes = Math.floor(Math.round(remainingMinutes - this.hours * 60));
        console.log("===== After =====")
            console.log("Days: ", this.days);
            console.log("Hours: ", this.hours);
            console.log("Minutes: ", this.minutes);

            return this;
    }

};