const db = require('../utils/database');

module.exports = class Review {
  constructor(userId, reviewerUserId, description, rating) {
    this.user_id = userId;
    this.reviewer_user_id = reviewerUserId;
    this.description = description;
    this.rating = rating;
  }

  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_review (user_id, reviewer_user_id, description, rating, created_at) VALUES (?,?,?,?,now())`,
      [this.user_id, this.reviewer_user_id, this.description, this.rating]
    );
  }

  static async getReviewsByUserId(userId, offSet, limit) {
    const result = await db.execute(
      `SELECT fname, lname, user_image, description, rating, created_at FROM SLDB.sl_review LEFT JOIN SLDB.sl_users ON SLDB.sl_review.reviewer_user_id = SLDB.sl_users.user_id WHERE SLDB.sl_review.user_id = ${userId} LIMIT ${offSet},${limit}`
    );
    return result[0];
  }
};
