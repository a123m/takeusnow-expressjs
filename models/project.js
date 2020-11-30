const db = require('../utils/database');

module.exports = class Project {
  constructor(
    categoryId,
    projectTitle,
    projectDescription,
    ownerId,
    reqSkills,
    reqOn,
    state,
    city,
    budget
  ) {
    (this.category_id = categoryId),
      (this.project_title = projectTitle),
      (this.project_description = projectDescription),
      (this.owner_id = ownerId),
      (this.req_skills = reqSkills),
      (this.req_on = reqOn),
      (this.state = state),
      (this.city = city),
      (this.budget = budget);
  }
  async save() {
    const result = await db.execute(
      `INSERT INTO SLDB.sl_project (project_title, project_description, project_status, owner_id,req_skills, req_on, country, state, city, budget, created_on, updated_on) 
      VALUES (?,?,1,?,?,?,101,?,?,?,now(),now())`,
      [
        this.project_title,
        this.project_description,
        this.owner_id,
        this.req_skills,
        this.req_on,
        this.state,
        this.city,
        this.budget,
      ]
    );

    await db.execute(
      `INSERT INTO SLDB.sl_project_users (project_id, user_id) VALUE (?,?)`,
      [result[0].insertId, this.owner_id]
    );

    await db.execute(
      `INSERT INTO SLDB.sl_project_category (project_id, category_id) VALUE (?,?)`,
      [result[0].insertId, this.category_id]
    );
    return result;
  }

  static async getFilteredProjects(
    categoryId,
    state,
    city,
    minBudget,
    offSet,
    limit
  ) {
    let sql = `SELECT sl_project.project_id, project_title, project_description, project_status, owner_id, created_on, updated_on, req_skills, req_on, budget, ap_id, pc_id, category_id, state_name, code, city_name FROM SLDB.sl_project 
    LEFT JOIN SLDB.sl_project_category ON SLDB.sl_project_category.project_id = SLDB.sl_project.project_id 
    LEFT JOIN SLDB.sl_state ON SLDB.sl_state.state_id = SLDB.sl_project.state 
    LEFT JOIN SLDB.sl_cities ON SLDB.sl_cities.id = SLDB.sl_project.city 
    WHERE SLDB.sl_project_category.category_id = ${categoryId} AND SLDB.sl_project.project_status = '1'`;
    if (minBudget) {
      sql += ` AND budget >= ${minBudget} `;
    }
    if (state) {
      sql += ` AND state = '${state}'`;
    }
    if (city) {
      sql += ` AND city = '${city}'`;
    }

    sql += ` ORDER BY created_on DESC LIMIT ${offSet},${limit}`;
    const result = await db.execute(sql);
    return result[0];
  }

  static async getProjectById(projectId) {
    const result = await db.execute(
      `SELECT project_id, project_title, project_description, sl_status.project_status, owner_id, created_on, updated_on, req_skills, req_on, budget, ap_id, sl_state.state_name as state_name, code, sl_cities.city_name as city_name, owner_review, worker_review FROM SLDB.sl_project 
      LEFT JOIN SLDB.sl_state ON sl_state.state_id = sl_project.state 
      LEFT JOIN SLDB.sl_cities ON sl_cities.id = sl_project.city 
      LEFT JOIN SLDB.sl_status ON sl_status.status_id = sl_project.project_status
      WHERE project_id = ${projectId}`
    );
    return result[0][0];
  }

  static async getProjectsByUserId(userId) {
    const result = await db.execute(
      `SELECT pu_id, P.project_id, user_id, PU.project_id, project_title, project_description, country, req_skills, s.project_status, state, city, budget, owner_id, created_on, updated_on, req_on, ap_id, status_id, description, owner_review, worker_review FROM SLDB.sl_project_users AS PU 
      LEFT JOIN SLDB.sl_project AS P ON PU.project_id = P.project_id LEFT JOIN SLDB.sl_status AS s ON s.status_id = P.project_status
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

  static async getAllCat() {
    const result = await db.execute(`SELECT * FROM SLDB.sl_categories`);
    return result[0];
  }

  static async getAllSubCat() {
    const result = await db.execute(`SELECT * FROM SLDB.sl_sub_categories`);
    return result[0];
  }

  static async acceptProposal(projectId, proposalId, proposalUserId) {
    await db.execute(
      `UPDATE SLDB.sl_proposals SET proposal_status = 1 WHERE proposal_id = ?`,
      [proposalId]
    );
    await db.execute(
      `UPDATE SLDB.sl_project SET ap_id = ?, project_status = '2' WHERE project_id = ?`,
      [proposalId, projectId]
    );
    await db.execute(
      `INSERT INTO SLDB.sl_project_users (project_id, user_id) VALUE (?,?)`,
      [projectId, proposalUserId]
    );
    const result = await db.execute(
      `SELECT owner_id FROM SLDB.sl_project WHERE project_id = ?`,
      [projectId]
    );
    return result[0][0];
  }

  static async updateReviewStatus(reviewer, projectId) {
    return db.execute(
      `UPDATE SLDB.sl_project SET ${reviewer} = ? WHERE project_id = ?`,
      [1, projectId]
    );
  }
};
