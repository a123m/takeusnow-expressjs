const db = require('../utils/database');

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
      `INSERT INTO SLDB.sl_project (sl_provider_id, project_name, project_description, skills_required, country, state, city, budget, validity, type, category, created_on, updated_on) 
      VALUES (${this.users_id},"${this.heading}","${this.details}","${this.requireSkills}","${this.country}", ${this.state}, ${this.city}, ${this.budget}, ${this.validity}, '${this.type}', '${this.category}', now(),now())`
    );
  }

  static async getFilteredProjects(
    categoryId,
    state,
    city,
    minBudget,
    offSet,
    limit
  ) {
    let sql = `SELECT * FROM SLDB.sl_project_category AS PC 
    LEFT JOIN SLDB.sl_project AS P ON PC.project_id = P.project_id 
    WHERE PC.category_id = ${categoryId}`;
    if (minBudget) {
      sql += ` AND budget >= ${minBudget} `;
    }
    if (state) {
      sql += ` AND state = ${state}`;
    }
    if (city) {
      sql += ` AND city = ${city}`;
    }

    sql += ` ORDER BY created_on DESC LIMIT ${offSet},${limit}`;

    const result = await db.execute(sql);
    return result[0];
  }

  static async getProjectById(projectId) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_project WHERE project_id = ${projectId}`
    );
    return result[0][0];
  }

  static async getProjectsByUserId(userId) {
    const result = await db.execute(
      `SELECT *  FROM SLDB.sl_project_users AS pu 
      LEFT JOIN SLDB.sl_project AS p ON pu.project_id = p.project_id 
      WHERE pu.user_id = ?`,
      [userId]
    );
    return result[0];
  }

  static async updateProjectById(projectId, status) {
    return db.execute(
      `UPDATE SLDB.sl_project SET proposal_status = '${status}'  WHERE proposal_id = ${projectId}`
    );
  }
};
