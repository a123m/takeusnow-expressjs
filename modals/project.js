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
    category,
    state,
    city,
    minBudget,
    maxBudget,
    offSet,
    limit
  ) {
    let sql = 'SELECT * FROM SLDB.sl_project WHERE 1=1';
    if (category) {
      sql += ` AND category = ${category}`;
    }
    if (minBudget) {
      sql += ` AND budget >= ${minBudget} `;
    }
    if (maxBudget) {
      sql += ` AND budget <= ${maxBudget}`;
    }
    if (state) {
      sql += ` AND state_id = ${state}`;
    }
    if (city) {
      sql += ` AND city_id = ${city}`;
    }
    if (offSet && limit) {
      sql += ` ORDER BY created_date DESC LIMIT ${offSet},${limit}`;
    }
    let result = await db.execute(sql);
    return result[0];
  }

  static async getProjectsByUserId() {
    let result = await db.execute(`SELECT * FROM SLDB.sl_project`);
    return result[0];
  }

  static async updateProjectById(projectId, status) {
    return db.execute(
      `UPDATE SLDB.sl_project SET proposal_status = '${status}'  WHERE proposal_id = ${projectId}`
    );
  }

  static async getProjectByIdWithProposals(projectId) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_project LEFT JOIN SLDB.sl_proposals ON SLDB.sl_project.project_id = SLDB.sl_proposals.sl_project_id WHERE SLDB.sl_proposals.sl_project_id= ?`,
      [projectId]
    );
    return result[0];
  }
};
