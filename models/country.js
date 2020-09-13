const db = require('../utils/database');

module.exports = class Portfolio {
  constructor(userId, imageName, imageUrl) {
    (this.user_id = userId),
      (this.image_name = imageName),
      (this.image_url = imageUrl);
  }

  static async getCountry() {
    const result = await db.execute(`SELECT * FROM SLDB.sl_country;`);
    return result[0];
  }

  static async getState() {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_state WHERE country_id = 101;`
    );
    return result[0];
  }

  static async getCity(id) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_cities WHERE state_id = ${id};`
    );
    return result[0];
  }
};
