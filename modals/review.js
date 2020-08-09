const db = require("../utils/database");

module.exports = class Review {
  constructor(userId, fullName, rating, description) {
    this.user_id = userId;
    this.full_name = fullName;
    this.rating = rating;
    this.description = description;
  }

  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_users (user_id, full_name, rating,rating) VALUES (?,?,?,?,?)`,
      [this.user_id, this.full_name, this.rating, this.rating]
    );
  }

  static async getReviewsByUserId(userId, offSet, limit) {
    const result = await db.execute(
      `SELECT fname, lname, user_image, description, rating, created_at FROM SLDB.sl_review LEFT JOIN SLDB.sl_users ON SLDB.sl_review.reviewer_users_id = SLDB.sl_users.user_id WHERE SLDB.sl_review.user_id = ${userId} LIMIT ${offSet},${limit}`
    );
    return result[0][0];
  }
};
