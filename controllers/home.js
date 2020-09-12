const { validationResult } = require('express-validator');

const io = require('../socket');

// const Project = require('../modals/project');
const User = require('../modals/user');

exports.getMainData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is incorrect');
      error.statusCode = 422;
      throw error;
    }

    const userId = req.body.userId;
    const firebaseToken = req.body.firebaseToken;

    const user = await User.fetchAllById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.fcm_token !== firebaseToken) {
      User.updateFcmToken(firebaseToken, userId);
    }
    // const projects = await Project.getProjects(location);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.createMessage = (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const message = req.body.message;
  try {
    io.getIO().emit('chat', { id: id, name: name, message: message });
  } catch (err) {
    next(err);
  }
};
