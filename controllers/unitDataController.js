/* 
const data = {};
data.employees = require('../data/employees.json'); */
const data = {
    unitData: require('../data/unitData.json'),
/*     setEmployees: function (data){
        { this.employees = data }
    } */
}
 
const getAllUnitData = (request, response) => {
    response.json(data);
}

module.exports = {
    getAllUnitData
}