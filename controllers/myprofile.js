const { validationResult } = require("express-validator");
// const Profile = require("../modals/profile");

// const io = require("../socket");

// const Project = require("../modals/project");
// const User = require("../modals/user");
const Profile = require("../modals/myprofile");

exports.getMainData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Entered Data is Incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const id = req.params.id;

    const profileData = await Profile.getMyProfileData(id);
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      const error = new Error("Profile Data Not Found");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
exports.getCatData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Entered Data is Incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const profileData = await Profile.getCategories();
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      const error = new Error("Category Data Not Found");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
exports.getSubCatData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Entered Data is Incorrect");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const cat_id = req.body.cat_id;

    const profileData = await Profile.getSubCategories(cat_id);
    if (profileData) {
      res.status(200).json(profileData);
    } else {
      const error = new Error("SubCategory Data Not Found");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
