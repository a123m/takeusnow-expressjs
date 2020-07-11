const db = require("../utils/database");

module.exports = class Project {
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

  getMyProfileData(id) {
    return db.execute(
      `SELECT SLDB.sl_users.user_id, fname, lname, about, state_id, city_id, dob, gender, experience,able_to_travel, SLDB.sl_portfolio.portfolio_id, SLDB.sl_portfolio.portfolio_name, SLDB.sl_portfolio.portfolio_image, equipment_name  FROM SLDB.sl_users LEFT JOIN SLDB.sl_portfolio ON SLDB.sl_users.user_id = SLDB.sl_portfolio.user_id LEFT JOIN SLDB.sl_user_categories ON SLDB.sl_users.user_id = SLDB.sl_user_categories.user_id LEFT JOIN SLDB.sl_my_equipments ON SLDB.sl_users.user_id = SLDB.sl_my_equipments.user_id WHERE SLDB.sl_users.user_id = ${id}`
    );
  }
  getCategories() {
    return db.execute(`SELECT * FROM sl_categories`);
  }
  getSubCategories(cat_id) {
    return db.execute(
      `SELECT * FROM sl_sub_categories WHERE cat_id = ${cat_id}`
    );
  }
};
