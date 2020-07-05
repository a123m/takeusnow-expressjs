const { validationResult } = require('express-validator');
// const Profile = require("../modals/profile");

// const io = require("../socket");

// const Project = require("../modals/project");
const User = require('../modals/user');

exports.getMainData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const id = req.params.id;

    const profileData = await User.fetchAllById(id);

    if (profileData) {
      res.status(200).json(profileData);
    } else {
      const error = new Error('Profile Data Not Found');
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

exports.updateProfileData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      throw error;
    }

    const id = req.body.id;
    const about = req.body.about;
    const state_id = req.body.state;
    const city_id = req.body.city;
    const my_skills = req.body.my_skills;
    const update = await User.updateProfile(
      id,
      about,
      state_id,
      city_id,
      my_skills
    );
    if (update) {
      res.status(200).json({ updateProfile: update });
    } else {
      const error = new Error('Data Entered is incorrect');
      error.statusCode = 400;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
