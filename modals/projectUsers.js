const db = require('../utils/database');

module.exports = class ProjectUsers {
  constructor(projectId, userId) {
    (this.project_id = projectId), (this.user_id = userId);
  }

  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_project_category (project_id,user_id)`,
      [this.project_id, this.user_id]
    );
  }
};
