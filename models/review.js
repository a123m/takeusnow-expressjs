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
    const average_review = await db.execute(`SELECT SUM(rating)/count(*) AS average_review FROM SLDB.sl_review WHERE user_id = ${userId}`);
    const total_reviews = await db.execute(`SELECT COUNT(*) AS total_reviews FROM SLDB.sl_review WHERE user_id = ${userId}`);
    const review_cal = {
      average_reviews: average_review[0][0].average_review,
      total_reviews: total_reviews[0][0].total_reviews,
      reviews: result[0],
    }
    return review_cal;
  }
};
