const db = require('../utils/database');

module.exports = class Proposal {
  constructor(userId, projectId, proposalDescription, proposedAmount) {
    (this.user_id = userId),
      (this.project_id = projectId),
      (this.proposal_description = proposalDescription),
      (this.proposed_amount = proposedAmount);
  }

  /**
   * create proposal_id automatically on every INSERT
   */
  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_proposals (user_id, project_id, proposal_description, proposed_amount, created_at) VALUES (?,?,?,?,now())`,
      [
        this.user_id,
        this.project_id,
        this.proposal_description,
        this.proposed_amount,
      ]
    );
  }

  static async getProposalById(proposalId) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_proposals AS P LEFT JOIN SLDB.sl_users AS U ON P.user_id = U.user_id WHERE proposal_id = ?`,
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

  static async checkProposalExist(userId, projectId) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_proposals AS P WHERE P.user_id = ${userId} AND P.project_id = ${projectId}`
    );
    return result[0][0];
  }

  static async updateProposalStatus(proposalId, status) {
    return db.execute(
      `UPDATE SLDB.sl_proposal SET proposal_status = '${status}'  WHERE proposal_id = ${proposalId}`
    );
  }
};
