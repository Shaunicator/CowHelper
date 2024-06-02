/* 
const data = {};
data.employees = require('../data/employees.json'); */
const data = {
    employees: require('../data/employees.json'),
    setEmployees: function (data){
        { this.employees = data }
    }
}
 
const getAllEmployees = (request, response) => {
    response.json(data.employees);
}

const createNewEmployee = (request, response) =>{
    const newEmployee = {
        id: data.employees[data.employees.length -1].id + 1 || 1,
        firstname: request.body.firstname,
        lastname: request.body.lastname
    }

if (!newEmployee.firstname || !newEmployee.lastname){
    return response.status(400).json({message: 'Frist and last names are required.'});
}

data.setEmployees([...data.employees, newEmployee]);
response.status(201).json(data.employees);

}

const updateEmployee = (request, response) => {
    const employee = data.employees.find(employee => employee.id === parseInt(request.body.id));
    if (!employee){
        return response.status(400).json({ 
            "message": `Employee ID ${request.body.id} not found.` 
        });
    }
    if (request.body.firstname) employee.firstname = req.body.firstname;
    if (request.body.lastname) employee.lastname = request.body.lastname;

    const filteredArray = data.employees.filter(employee => employee.id !== parseInt(request.body.id));
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
    response.json(data.employees);
}

const deleteEmployee = (request, response) => {
    response.json({"id": request.body.id})
}

const getEmployee = (request, response) => {
    response.json({ "id": request.params.id })
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}