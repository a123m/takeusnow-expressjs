const db = require("../utils/database");

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
      `INSERT INTO SLDB.sl_users (fname, lname, email, password_hash, gender, account_type, account_type_sub, mobile_num) VALUES (?,?,?,?,?,?,?,?)`,
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
  static async fetchAll() {
    return db.execute(`SELECT * FROM products`);
  }

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

  static async updateProfile(id, about, state_id, city_id, my_skills) {
    my_skills = JSON.stringify(my_skills);
    let result = await db.execute(
      `UPDATE SLDB.sl_users SET about = "${about}", state_id = ${state_id}, city_id = ${city_id}, my_skills = '${my_skills}' WHERE id = ${id}`
    );
    return result[0];
  }

  static async forgetpassword(id, password) {
    // console.log(id);
    let result = await db.execute(
      `UPDATE SLDB.sl_users SET password_hash = '${password}'  WHERE user_id = ${id}`
    );
    return result[0];
  }
};
