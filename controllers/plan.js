const { validationResult } = require('express-validator');


// const Project = require('../models/project');
const Plan = require('../models/plan');

exports.getPlanData = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Entered Data is incorrect');
            error.statusCode = 422;
            throw error;
        }

        const plan = await Plan.getPlan();

        if (!plan) {
            const error = new Error('No Plan table exist');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(plan);
    } catch (err) {
        next(err);
    }
};

exports.getPlanById = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Entered Data is incorrect');
            error.statusCode = 422;
            throw error;
        }

        const user_id = req.params.user_id;

        const plan = await Plan.getPlanbyId(user_id);

        if (!plan) {
            const error = new Error('Plan not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(plan);
    } catch (err) {
        next(err);
    }
};

exports.updatePlan = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Entered Data is incorrect');
            error.statusCode = 422;
            throw error;
        }

        const user_id = req.body.user_id;
        const plan_id = req.body.plan_id;

        const plan = await Plan.purchasePlan(plan_id, user_id);

        if (!plan) {
            const error = new Error('Plan not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ plan: plan, message: "Plan Updated Succesfully" });
    } catch (err) {
        next(err);
    }
};