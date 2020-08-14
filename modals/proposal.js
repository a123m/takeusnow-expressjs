const db = require('../utils/database');

module.exports = class Proposal {
  constructor(
    projectId,
    userId,
    fullName,
    proposedPrice,
    createdAt,
    description,
    status
  ) {
    (this.project_id = projectId),
      (this.user_id = userId),
      (this.full_name = fullName),
      (this.proposed_price = proposedPrice),
      (this.created_at = createdAt),
      (this.description = description),
      (this.status = status);
  }

  /**
   * create proposal_id automatically on every INSERT
   */
  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_users (user_id, project_id, full_name, proposed_price, created_on=now(), proposal_description,status) VALUES (?,?,?,?)`,
      [
        this.user_id,
        this.project_id,
        this.full_name,
        this.proposed_price,
        this.description,
        this.status,
      ]
    );
  }

  static async getProposalById(proposalId) {
    const result = db.execute(
      `SELECT * FROM SLDB.sl_proposal WHERE proposal_id = ?`,
      [proposalId]
    );
    return result[0][0];
  }

  static async getProposalsByProjectId(projectId) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_proposals AS P LEFT JOIN SLDB.sl_users AS U ON U.user_id = P.user_id WHERE P.project_id = ${projectId}`
    );
    return result[0];
  }

  static async updateProposalStatus(proposalId, status) {
    return db.execute(
      `UPDATE SLDB.sl_proposal SET proposal_status = '${status}'  WHERE proposal_id = ${proposalId}`
    );
  }
};
