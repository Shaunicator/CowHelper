import express from 'express';
import * as unitDataController from '../../controllers/unitDataController.mjs'

/* You can use an array :
router.get(['/', '/:param'], myMethod); */
//router.route('/').get(unitDataController.getUnitData_ALL);
const router = express.Router();
router.route('/getUnit/:unit/:doctrine?')
    .get(unitDataController.getUnitData)
router.route('/getAll')
    .get(unitDataController.getUnitData_ALL)

export default router;