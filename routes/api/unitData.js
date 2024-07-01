
import express from 'express';

//const router = express.Router();
import * as path from 'path';
//const path = require('path');
import * as unitDataController from '../../controllers/unitDataController.js'
//const unitDataController = require('../../controllers/unitDataController')


/* You can use an array :

router.get(['/', '/:param'], myMethod); */

//router.route('/').get(unitDataController.getUnitData_ALL);
const router = express.Router();
router.route('/getUnit/:unit/:doctrine?')
    .get(unitDataController.getUnitData)
router.route('/getAll')
    .get(unitDataController.getUnitData_ALL)

/*router.route('/:id')
    .get(employeesController.getEmployee); */

export { router as unitData };