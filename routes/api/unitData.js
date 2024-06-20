const express = require('express');
const router = express.Router();
const path = require('path');
const unitDataController = require('../../controllers/unitDataController')


//router.route('/').get(unitDataController.getUnitData_ALL);
router.route('/getUnit/:unit')
    .get(unitDataController.getUnitData)
router.route('/getAll')
    .get(unitDataController.getUnitData_ALL)

/*router.route('/:id')
    .get(employeesController.getEmployee); */

module.exports = router;