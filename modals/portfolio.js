const db = require('../utils/database');

module.exports = class Portfolio {
  constructor(userId, imageName, imageUrl, createdOn) {
    (this.user_id = userId),
      (this.image_name = imageName),
      (this.image_url = imageUrl),
      (this.created_on = createdOn);
  }

  /**
   * It create portfolio_id automatically on every INSERT
   */
  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_portfolio (user_id, image_name, image_url, created_on) VALUES (?,?,?,?)`,
      [this.user_id, this.image_name, this.image_url, this.created_on]
    );
  }

  static async getImagesByUserId(userId) {
    const result = db.execute(
      `SELECT * FROM SLDB.sl_portfolio WHERE user_id = ?`,
      [userId]
    );
    return result[0];
  }
};
