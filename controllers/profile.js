const fs = require('fs');

const { validationResult } = require('express-validator');

const User = require('../modals/user');
const Portfolio = require('../modals/portfolio');

exports.getMainData = async (req, res, next) => {
  try {
    const userId = JSON.parse(req.params.userId);

    const profileData = await User.fetchAllById(userId);
    let portfolioData = await Portfolio.getImagesByUserId(userId);

    if (!profileData) {
      const error = new Error('Profile Data Not Found');
      error.statusCode = 404;
      throw error;
    }
    if (!portfolioData) {
      portfolioData = [];
    }

    let gender = profileData.gender;
    if (gender === 'm') {
      gender = 'Male';
    }
    if (gender === 'f') {
      gender = 'Female';
    }

    profileData.gender = gender;
    profileData.portfolio = portfolioData;

    res.status(200).json(profileData);
  } catch (err) {
    next(err);
  }
};

exports.portfolioUpload = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Please upload a file');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.body.userId;
    const file = req.file;
    const imageName = file.originalname;
    const imageUrl = file.path;

    const portfolio = new Portfolio(userId, imageName, imageUrl);
    const result = await portfolio.save();
    res.status(200).json({
      portfolio_id: result[0].insertId,
      image_url: imageUrl,
      image_name: imageName,
    });
  } catch (err) {
    next(err);
  }
};

exports.portfolioDelete = async (req, res, next) => {
  try {
    const portfolioId = req.params.portfolioId;
    const image = await Portfolio.getAllById(portfolioId);
    if (!image) {
      const error = new Error(
        'Image is already deleted. Please restart the application.'
      );
      error.statusCode = 422;
      throw error;
    }
    Portfolio.deleteById(portfolioId);
    fs.unlinkSync(image.image_url);
    res.status(200).json({ message: 'delete success' });
  } catch (err) {
    next(err);
  }
};

exports.userImageUpload = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userImage = req.file.path;

    const user = await User.fetchAllById(userId);
    if (user.user_image.length > 0) {
      fs.unlinkSync(user.user_image);
    }

    await User.updateProfileImage(userId, userImage);
    res.status(200).json({ message: 'image updated' });
  } catch (err) {
    next(err);
  }
};

exports.updateProfileData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered data has incorrect type');
      error.statusCode = 422;
      throw error;
    }

    const userId = req.params.userId;
    const ableToTravel = req.body.ableToTravel;
    const about = req.body.about;
    const state = req.body.state;
    const city = req.body.city;
    const dateOfBirth = req.body.dateOfBirth;
    const languagesKnown = JSON.stringify(req.body.languagesKnown);
    const myEquipments = JSON.stringify(req.body.myEquipments);
    const mySkills = JSON.stringify(req.body.mySkills);
    const workExperience = req.body.workExperience;

    const update = await User.updateProfile(
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
    );
    if (!update) {
      const error = new Error('Profile update failed. Please try again later!');
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({ message: 'Profile Updated!' });
  } catch (err) {
    next(err);
  }
};
