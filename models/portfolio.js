const db = require('../utils/database');

module.exports = class Portfolio {
  constructor(userId, imageUrl) {
    (this.user_id = userId), (this.image_url = imageUrl);
  }

  /**
   * It create portfolio_id automatically on every INSERT
   */
  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_portfolio (user_id, image_url, created_on) VALUES (?,?,now())`,
      [this.user_id, this.image_url]
    );
  }

  static async getAllById(portfolioId) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_portfolio WHERE portfolio_id = ?`,
      [portfolioId]
    );
    return result[0][0];
  }

  static deleteById(portfolioId) {
    return db.execute(`DELETE FROM SLDB.sl_portfolio WHERE portfolio_id = ?`, [
      portfolioId,
    ]);
  }

  static async getImagesByUserId(userId) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_portfolio WHERE user_id = ?`,
      [userId]
    );
    return result[0];
  }
};
