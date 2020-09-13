const db = require('../utils/database');

module.exports = class User {
  constructor(
    fname,
    lname,
    email,
    password,
    gender,
    accountType,
    accountTypeSub,
    mobileNum
  ) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.account_type = accountType;
    this.account_type_sub = accountTypeSub;
    this.mobile_num = mobileNum;
  }

  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_users 
      (fname, lname, email, password_hash, gender, account_type, account_type_sub, mobile_num, created_on, updated_on) 
      VALUES (?,?,?,?,?,?,?,?,now(),now())`,
      [
        this.fname,
        this.lname,
        this.email,
        this.password,
        this.gender,
        this.account_type,
        this.account_type_sub,
        this.mobile_num,
      ]
    );
  }

  //   static deleteById(id) {}

  /**
   * static function execute fast
   */
  static async findByEmail(email) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_users WHERE email = ?`,
      [email]
    );
    return result[0][0];
  }

  static async fetchAllById(id) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_users WHERE user_id = ?`,
      [id]
    );
    return result[0][0];
  }

  static async fetchAUsers(offSet, limit) {
    const result = await db.execute(
      `SELECT * FROM SLDB.sl_users LIMIT ${offSet},${limit}`
    );
    return result[0];
  }

  static async updateProfileImage(userId, userImage) {
    const result = await db.execute(
      `UPDATE SLDB.sl_users SET user_image = '${userImage}', updated_on = now() WHERE user_id = ${userId}`
    );
    return result[0];
  }

  static async updateProfile(
    userId,
    ableToTravel,
    about,
    state,
    city,
    dateOfBirth,
    languagesKnown,
    myEquipments,
    mySkills,
    workExperience
  ) {
    const result = await db.execute(
      `UPDATE SLDB.sl_users SET about = '${about}', able_to_travel = '${ableToTravel}', 
      state = '${state}', city = '${city}', dob = '${dateOfBirth}', languages_known = '${languagesKnown}', 
      my_equipments = '${myEquipments}', my_skills = '${mySkills}', work_experience = '${workExperience}' 
      WHERE user_id = ${userId}`
    );
    return result[0];
  }

  static async forgetPassword(userId, password) {
    const result = await db.execute(
      `UPDATE SLDB.sl_users SET password_hash = '${password}'  WHERE user_id = ${userId}`
    );
    return result[0];
  }

  static async validateEmail(userId) {
    const result = await db.execute(
      `UPDATE SLDB.sl_users SET email_verify = '1'  WHERE user_id = ${userId}`
    );
    return result[0];
  }
  static async decreaseAllowedBids(userId) {
    const result = await db.execute(
      `UPDATE SLDB.sl_users SET allowed_bids = allowed_bids - 1 WHERE user_id = ${userId}`
    );
    return result[0];
  }

  // * Update firebase token of the user
  static async updateFcmToken(firebaseToken, userId) {
    const result = await db.execute(
      `UPDATE SLDB.sl_users SET fcm_token = ? WHERE user_id = ?`,
      [firebaseToken, userId]
    );
    return result[0];
  }
};