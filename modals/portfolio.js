const db = require("../utils/database");

module.exports = class Portfolio {
  constructor(portfolio_name, portfolio_image, user_id) {
    (this.portfolio_name = portfolio_name),
      (this.portfolio_image = portfolio_image),
      (this.user_id = user_id);
  }
  save() {
    return db.execute(
      `INSERT INTO SLDB.sl_portfolio (portfolio_name, portfolio_image, user_id, created_date, updated_date) 
        VALUES (${this.portfolio_name},"${this.portfolio_image}","${this.user_id}", now(),now())`
    );
  }
};
