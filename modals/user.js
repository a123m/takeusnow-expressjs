const db = require("../utils/database");

module.exports = class User {
  constructor(fname, lname, email, password, gender, file) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.file = file;
  }

  save() {
    if (this.file) {
      return db.execute(
        `INSERT INTO SLDB.sl_users (fname, lname, email, password_hash, gender, file) VALUES (?,?,?,?,?)`,
        [
          this.fname,
          this.lname,
          this.email,
          this.password,
          this.gender,
          this.file,
        ]
      );
    } else {
      return db.execute(
        `INSERT INTO SLDB.sl_users (fname, lname, email, password_hash, gender) VALUES (?,?,?,?,?)`,
        [
          this.fname,
          this.lname,
          this.email,
          this.password,
          this.gender,
          // this.file,
        ]
      );
    }
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
    let result = await db.execute(`SELECT * FROM SLDB.sl_users WHERE id = ?`, [
      id,
    ]);
    return result[0][0];
  }

  static async updateProfile(id, about, state_id, city_id, my_skills) {
    my_skills = JSON.stringify(my_skills);
    let result = await db.execute(
      `UPDATE SLDB.sl_users SET about = "${about}", state_id = ${state_id}, city_id = ${city_id}, my_skills = '${my_skills}' WHERE user_id = ${id}`
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
