/* 
const data = {};
data.employees = require('../data/employees.json'); */
const data={};
data.units = require('../data/unitData.json')
/*     setEmployees: function (data){
        { this.employees = data }
    } */

 
const getUnitData = (request, response) => {
    let unit = request.params.unit
    console.log(`REQ: GET UnitData(${unit})`);
    
    response.json(data.units[unit]);
}

const getUnitData_ALL = (request,response) => {
    console.log("Get All Data");
    response.json(data.units);
}

module.exports = {
    getUnitData_ALL, getUnitData
}