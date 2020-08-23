const db = require('../utils/database');

module.exports = class ProjectCategory {
  constructor(projectId, categoryId) {
    (this.project_id = projectId), (this.category_id = categoryId);
  }

  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_project_category (project_id, category_id) VALUE (?,?)`,
      [this.project_id, this.category_id]
    );
  }
};
