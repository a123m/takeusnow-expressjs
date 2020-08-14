const { validationResult } = require('express-validator');
const User = require('../modals/user');
const Project = require('../modals/project');
const Review = require('../modals/review');

exports.createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect', errors);
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.body.userId;
    const title = req.body.title;
    const detail = req.body.detail;
    const requireSkills = req.body.requireSkills;
    const country = req.body.country;
    const state = req.body.state;
    const status = req.body.status;
    const city = req.body.city;
    const budget = req.body.budget;
    const validity = req.body.validity;
    const category = req.body.category;

    const project = new Project(
      userId,
      title,
      detail,
      requireSkills,
      country,
      state,
      status,
      city,
      budget,
      validity,
      category
    );
    await project.save();
    res.status(200).json({
      message: 'Project created Successfully!',
      // project_id: result[0].insertId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMainData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.params.userId;

    const projects = await Project.getProjectsByUserId(userId);

    if (!projects) {
      const error = new Error('Project Data Not Found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const projectId = req.params.projectId;

    const result = Project.getProjectById(projectId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const projectId = req.body.projectId;
    const status = req.body.status;

    await Project.updateProjectById(projectId, status);

    res.status(200).json({ message: 'Status updated' });
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.body.userId;
    const reviewProviderId = req.body.reviewProviderId;
    const rating = req.body.rating;
    const description = req.body.description;

    const result = await User.fetchAllById(reviewProviderId);

    const fullName = result.fname.concat(' ', result.lname);

    await Review.save(userId, fullName, rating, description);

    res.status(200).json({ message: 'Review Saved' });
  } catch (err) {
    next(err);
  }
};
