const db = require('../utils/database');

module.exports = class Project {
  constructor(
    projectTitle,
    projectDescription,
    projectStatus,
    reqSkills,
    state,
    city,
    budget
  ) {
    (this.project_title = projectTitle),
      (this.project_description = projectDescription),
      (this.project_status = projectStatus),
      (this.req_skills = reqSkills),
      (this.state = state),
      (this.city = city),
      (this.budget = budget);
  }
  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_project (project_title, project_description, project_status, req_skills, state, city, budget, created_on, updated_on) 
      VALUES (?,?,?,?,?,?,?, now(),now())`,
      [
        this.project_title,
        this.project_description,
        this.project_status,
        this.req_skills,
        this.state,
        this.city,
        this.budget,
      ]
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
    WHERE PC.category_id = ${categoryId} AND P.project_status = 'ACTIVE'`;
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
      `SELECT * FROM SLDB.sl_project_users AS PU 
      LEFT JOIN SLDB.sl_project AS P ON PU.project_id = P.project_id 
      WHERE PU.user_id = ?`,
      [userId]
    );
    return result[0];
  }

  static async updateProjectById(projectId, status) {
    return db.execute(
      `UPDATE SLDB.sl_project SET project_status = '${status}' WHERE project_id = ${projectId}`
    );
  }
};
