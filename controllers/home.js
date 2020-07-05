const { validationResult } = require('express-validator');
// const Profile = require("../modals/profile");

const io = require('../socket');

// const Project = require('../modals/project');
const User = require('../modals/user');

exports.getMainData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      throw error;
    }

    const id = req.body.id;
    // const location = req.body.location;

    const userData = await User.fetchAllById(id);
    // const projects = await Project.getProjects(location);

    res.status(200).json(userData);
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
