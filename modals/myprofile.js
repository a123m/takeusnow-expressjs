const db = require("../utils/database");

module.exports = class Profile {
  constructor(
    userId,
    heading,
    details,
    requireSkills,
    country,
    state,
    city,
    budget,
    validity,
    type,
    category
  ) {
    (this.users_id = userId),
      (this.heading = heading),
      (this.details = details),
      (this.requireSkills = requireSkills),
      (this.country = country),
      (this.state = state),
      (this.city = city),
      (this.budget = budget),
      (this.validity = validity),
      (this.type = type),
      (this.category = category);
  }
  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_project (sl_provider_id, project_name, project_description, skills_required, country, state, city, budget, validity, type, category, created_date, updated_date) 
      VALUES (${this.users_id},"${this.heading}","${this.details}","${this.requireSkills}","${this.country}", ${this.state}, ${this.city}, ${this.budget}, ${this.validity}, '${this.type}', '${this.category}', now(),now())`
    );
  }

  static async getMyProfileData(id) {
    let data;
    const sql = `SELECT SLDB.sl_users.user_id, fname, lname, about, state_id, city_id, dob, gender, experience,able_to_travel, profile_image , languages_known FROM SLDB.sl_users WHERE SLDB.sl_users.user_id = ${id}; \
                 SELECT * FROM SLDB.sl_categories; 
                 SELECT portfolio_name, portfolio_image FROM SLDB.sl_portfolio WHERE user_id = ${id};
                 SELECT * FROM SLDB.sl_my_equipments WHERE user_id = ${id} `;
    let result = await db.query(sql, [id], (result) => {
      return result;
    });
    data = {
      user: result[0][0],
      catData: result[0][1],
      portfolio: result[0][2],
      my_equipments: result[0][3],
    };
    return data;
  }

  static async getSubCategories(cat_id) {
    return await db.execute(
      `SELECT * FROM sl_sub_categories WHERE cat_id = ${cat_id}`
    );
  }
};
