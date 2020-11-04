const express = require('express');
const { body, param } = require('express-validator');
const isAuth = require('../middleware/is-auth');

const planController = require('../controllers/plan');

const router = express.Router();

router.get("/get", planController.getPlanData);

router.get("/get/:user_id",
    // isAuth, 
    param('user_id').isNumeric(), planController.getPlanById);

router.patch("/update", isAuth, [body('plan_id').isNumeric(), body('user_id').isNumeric()], planController.updatePlan)

module.exports = router;
