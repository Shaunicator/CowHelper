const express = require('express');
const router = express.Router();
const path = require('path');
const unitDataController = require('../../controllers/contoller.unitData')

/* You can use an array :
router.get(['/', '/:param'], myMethod); */
//router.route('/').get(unitDataController.getUnitData_ALL);

router.route('/getUnit/:unit/:doctrine?')
    .get(unitDataController.getUnitData)
router.route('/getAll')
    .get(unitDataController.getUnitData_ALL)

    module.exports = router;