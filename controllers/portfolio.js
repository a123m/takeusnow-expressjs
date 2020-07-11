const { validationResult } = require("express-validator");
// const Profile = require("../modals/profile");

// const io = require("../socket");

// const Project = require("../modals/project");
const Portfolio = require("../modals/portfolio");

exports.getMainData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Entered Data is Incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const portfolio_name = req.body.portfolio_name;
    const portfolio_image = req.file.portfolio_image;
    const user_id = req.body.user_id;

    const user = new Portfolio(portfolio_name, portfolio_image, user_id);
    // console.log(user);
    const result = await user.save();
    res
      .status(200)
      .json({ message: "User created!", user_id: result[0].insertId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
