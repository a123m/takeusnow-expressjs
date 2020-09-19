const streamifier = require('streamifier');

const { validationResult } = require('express-validator');

const User = require('../models/user');
const Portfolio = require('../models/portfolio');

const s3 = require('../utils/s3.config');

exports.getMainData = async (req, res, next) => {
  try {
    const userId = req.params.userId;

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
    const s3Client = s3.s3Client;
    const params = s3.uploadParams;

    const userId = req.params.userId;
    const imageName = Date.now() + req.file.originalname;

    // To store the path of the file in server storage
    // const userImage = req.file.path;

    params.Key = 'portfolio/' + imageName;
    params.Body = streamifier.createReadStream(req.file.buffer);

    s3Client.upload(params, async (err, s3Res) => {
      if (err) {
        return next(err);
      }

      try {
        const imageUrl = s3Res.Location;
        const portfolio = new Portfolio(userId, imageUrl);
        const result = await portfolio.save();
        res.status(200).json({
          portfolio_id: result[0].insertId,
          image_url: imageUrl,
          image_name: imageName,
        });
      } catch (err) {
        next(err);
      }
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
      error.statusCode = 400;
      throw error;
    }

    const s3Client = s3.s3Client;
    const params = s3.deleteParams;

    const imageUrl = image.image_url;
    const startIndex = imageUrl.indexOf('portfolio/');
    const userImageKey = imageUrl.slice(startIndex, imageUrl.length);
    params.Key = userImageKey;

    s3Client.deleteObject(params, (err) => {
      if (err) {
        return next(err);
      }
      try {
        Portfolio.deleteById(portfolioId);
        // fs.unlinkSync(image.image_url);
        res.status(200).json({ message: 'delete success' });
      } catch (err) {
        next(err);
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.userImageUpload = async (req, res, next) => {
  try {
    const s3Client = s3.s3Client;
    const uploadParams = s3.uploadParams;
    const deleteParams = s3.deleteParams;

    const userId = req.params.userId;
    // * To store the path of the file in server storage
    // const userImage = req.file.path;
    const imageName = Date.now() + req.file.originalname;
    uploadParams.Key = 'user/' + imageName;
    uploadParams.Body = streamifier.createReadStream(req.file.buffer);

    const user = await User.fetchAllById(userId);
    if (user.user_image.length > 0) {
      const startIndex = user.user_image.indexOf('user/');
      const userImageKey = user.user_image.slice(
        startIndex,
        user.user_image.length
      );
      deleteParams.Key = userImageKey;
      s3Client.deleteObject(deleteParams, (err) => {
        if (err) {
          return err;
        }
      });
      // fs.unlinkSync(user.user_image);
    }

    s3Client.upload(uploadParams, async (err, s3Res) => {
      if (err) {
        return next(err);
      }
      await User.updateProfileImage(userId, s3Res.Location);
    });
    res.status(200).json({ message: 'Profile Image updated.' });
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
