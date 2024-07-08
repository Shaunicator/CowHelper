export class Player {

    userName;
    startingFaction; //this could be changed to something less specific
    territories = [];
    armies = [];
    score;

    constructor(userName, country) {

    }

    get score() {
        return this.score;
    }
    
    set score(newScore) {
        this.score = newScore;
    }
}