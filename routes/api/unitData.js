const express = require('express');
const router = express.Router();
const path = require('path');
const unitDataController = require('../../controllers/unitDataController')


router.route('/')
    .get(unitDataController.getAllUnitData)

/*router.route('/:id')
    .get(employeesController.getEmployee); */

module.exports = router;