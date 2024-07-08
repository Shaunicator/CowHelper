export class Territory{

    territoryName;
    owningFaction;
    resourceType;

    constructor(){

    }
}

export class City extends Territory{
    constructor(){
        super(this.territoryName, this.owningFaction, this.resourceType)
    }
}