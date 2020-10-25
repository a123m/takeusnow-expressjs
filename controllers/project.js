const { validationResult } = require('express-validator');
const { sendNotification } = require('../utils/notification');

const Project = require('../models/project');
const Review = require('../models/review');
const Proposal = require('../models/proposal');
const User = require('../models/user');

exports.getMainData = async (req, res, next) => {
  try {
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

exports.createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect', errors);
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const categoryId = req.body.categoryId;
    const projectTitle = req.body.projectTitle;
    const projectDescription = req.body.projectDescription;
    const projectStatus = req.body.projectStatus;
    const ownerId = req.body.ownerId;
    const reqSkills = JSON.stringify(req.body.reqSkills);
    const reqOn = new Date(req.body.reqOn).toISOString();
    const state = req.body.state;
    const city = req.body.city;
    const budget = req.body.budget;

    const project = new Project(
      categoryId,
      projectTitle,
      projectDescription,
      projectStatus,
      ownerId,
      reqSkills,
      reqOn,
      state,
      city,
      budget
    );

    const result = await project.save();

    res.status(200).json({
      projectId: result[0].insertId,
      message: 'Project created successfully!',
    });
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
    const projectId = req.params.projectId;
    const status = req.query.status;

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

    const accountType = req.query.accountType;

    const projectId = req.body.projectId;
    const reviewerUserId = req.body.reviewerUserId;
    const description = req.body.description;
    const rating = req.body.rating;

    const project = await Project.getProjectById(projectId);

    if (accountType === 'work') {
      const review = new Review(
        project.owner_id,
        reviewerUserId,
        description,
        rating
      );
      review.save();
    }

    if (accountType === 'hire') {
      const proposal = await Proposal.getProposalById(project.ap_id);
      const review = new Review(
        proposal.owner_id,
        reviewerUserId,
        description,
        rating
      );
      review.save();
    }

    res.status(200).json({ message: 'Review Saved' });
  } catch (err) {
    next(err);
  }
};

exports.catAndSubCat = async (req, res, next) => {
  try {
    const categories = await Project.getAllCat();
    const subCat = await Project.getAllSubCat();

    if (!categories || !subCat) {
      const error = new Error('Category or Sub-Category Not Found!!');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ categories: categories, sub_categories: subCat });
  } catch (err) {
    next(err);
  }
};

exports.acceptProposal = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const proposalId = req.params.proposalId;
    const proposal = await Proposal.getProposalById(proposalId);
    const project = await Project.acceptProposal(
      projectId,
      proposalId,
      proposal.user_id
    );
    const user = await User.getFCMToken(project.owner_id);
    sendNotification(
      'Congratulation',
      `Your Proposal is accepted.`,
      user.fcm_token
    );
  } catch (err) {
    next(err);
  }
};
