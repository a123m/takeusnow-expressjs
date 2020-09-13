const db = require('../utils/database');

module.exports = class Project {
  constructor(
    categoryId,
    projectTitle,
    projectDescription,
    projectStatus,
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
      (this.project_status = projectStatus),
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
      VALUES (?,?,?,?,?,?,101,?,?,?,now(),now())`,
      [
        this.project_title,
        this.project_description,
        this.project_status,
        this.owner_id,
        this.req_skills,
        this.req_on,
        this.state,
        this.city,
        this.budget,
      ]
    );

    db.execute(
      `INSERT INTO SLDB.sl_project_users (project_id, user_id) VALUE (?,?)`,
      [result[0].insertId, this.owner_id]
    );

    db.execute(
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
    let sql = `SELECT sl_project.project_id, project_title, project_description, project_status, owner_id, created_on, updated_on, req_skills, req_on, budget, ap_id, pc_id, category_id, state_name, code, city_name FROM SLDB.sl_project LEFT JOIN SLDB.sl_project_category ON SLDB.sl_project_category.project_id = SLDB.sl_project.project_id LEFT JOIN SLDB.sl_state ON SLDB.sl_state.state_id = SLDB.sl_project.state LEFT JOIN SLDB.sl_cities ON SLDB.sl_cities.id = SLDB.sl_project.city WHERE SLDB.sl_project_category.category_id = ${categoryId} AND SLDB.sl_project.project_status = 'ACTIVE'`;
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
      `SELECT project_id, project_title, project_description, project_status, owner_id, created_on, updated_on, req_skills, req_on, budget, ap_id, sl_state.name as state_name, code, sl_cities.name as city_name FROM SLDB.sl_project LEFT JOIN sl_state ON sl_state.state_id = sl_project.state LEFT JOIN sl_cities ON sl_cities.id = sl_project.city WHERE project_id = ${projectId}`
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

  static async getAllCat() {
    const cat = await db.execute(
      `SELECT * FROM SLDB.sl_categories WHERE status = '1'`
    );
    const subCat = await db.execute(
      `SELECT * FROM SLDB.sl_sub_categories WHERE status = '1';`
    );
    const result = { category: cat[0], sub_category: subCat[0] };
    return result;
  }
};
