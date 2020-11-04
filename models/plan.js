const db = require('../utils/database');

module.exports = class Plan {
    constructor() { }

    static async getPlan() {
        const result = await db.execute(
            `SELECT * FROM SLDB.sl_plan`
        );
        return result[0];
    }

    static async getPlanbyId(user_id) {
        const expiry_check = await db.execute(`SELECT SLDB.sl_users.plan_purchase_date, SLDB.sl_user_plan.plan_expiry_date FROM SLDB.sl_users LEFT JOIN SLDB.sl_user_plan ON sl_user_plan.plan_purchase_user_id = sl_users.user_id WHERE user_id = ${user_id} ORDER BY plan_purchase_date DESC LIMIT 1`);
        let day = expiry_check[0][0].plan_expiry_date;
        let date = new Date();
        var status;
        if (day >= date) {
            status = { status: 'available' };
        } else {
            status = { status: 'expired' };
        }
        const result = await db.execute(
            `SELECT user_id, fname, lname, email, state, city, plan_in_use, allowed_bids, mobile_num, account_type, account_type_sub,plan_name, plan_cost, number_of_bids, expiry_in_days, plan_purchase_id, SLDB.sl_user_plan.plan_purchase_date,SLDB.sl_user_plan.plan_expiry_date 
            FROM SLDB.sl_users 
            LEFT JOIN SLDB.sl_plan ON sl_plan.plan_id = sl_users.plan_in_use 
            LEFT JOIN SLDB.sl_user_plan ON sl_user_plan.plan_purchase_id = sl_users.plan_in_use 
            WHERE sl_users.user_id = ${user_id} 
            ORDER BY plan_purchase_date DESC LIMIT 1`
        );
        const details = {
            plan: result[0],
            expiry: status
        }

        if (details.expiry.status == 'expired') {
            db.execute(`UPDATE SLDB.sl_users SET plan_in_use = '1' WHERE user_id = ${user_id}`)
            db.execute(`INSERT INTO SLDB.sl_user_plan (plan_purchase_user_id, plan_purchase_id, plan_purchase_date, plan_expiry_date) VALUES ('${user_id}', '1', now(), DATE_ADD(now(), INTERVAL 30 DAY))`)
        }
        return details;
    }

    static async purchasePlan(plan_id, user_id) {
        const expiry_day = await db.execute(`SELECT * FROM SLDB.sl_plan WHERE plan_id = ${plan_id}`)
        let day = expiry_day[0][0].expiry_in_days;
        if (day) {
            const result = await db.execute(`UPDATE SLDB.sl_users SET plan_in_use = '${plan_id}',plan_purchase_date= now(), plan_expiry_date= DATE_ADD(now(), INTERVAL ${day} DAY) WHERE user_id = ${user_id}`)
            db.execute(`INSERT INTO SLDB.sl_user_plan (plan_purchase_user_id, plan_purchase_id, plan_purchase_date, plan_expiry_date) VALUES ('${user_id}', '${plan_id}', now(), DATE_ADD(now(), INTERVAL ${day} DAY))`)
            return result[0];
        }
    }
};