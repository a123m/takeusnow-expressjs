const db = require('../utils/database');

module.exports = class User {
  constructor(fname, lname, email, password, gender) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.password = password;
    this.gender = gender;
  }

  save() {
    if ((this.account_type, this.account_type_sub, this.mobile_num)) {
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
    } else {
      return db.execute(
        `INSERT INTO SLDB.sl_users 
      (fname, lname, email, password_hash, gender, created_on, updated_on) 
      VALUES (?,?,?,?,?,now(),now())`,
        [this.fname, this.lname, this.email, this.password, this.gender]
      );
    }
  }

  //   static deleteById(id) {}

  /**
   * static function execute fast
   */
  static async findByEmail(email) {
    let result = await db.execute(
      `SELECT * FROM SLDB.sl_users WHERE email = ?`,
      [email]
    );
    return result[0][0];
  }

  static async fetchAllById(id) {
    let result = await db.execute(
      `SELECT * FROM SLDB.sl_users WHERE user_id = ?`,
      [id]
    );
    return result[0][0];
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

  static async forgetPassword(id, password) {
    // console.log(id);
    const result = await db.execute(
      `UPDATE SLDB.sl_users SET password_hash = '${password}'  WHERE user_id = ${id}`
    );
    return result[0];
  }
};
