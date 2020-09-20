const { validationResult } = require('express-validator');

const User = require('../models/user');
const Project = require('../models/project');
const Proposal = require('../models/proposal');

exports.getMainData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is incorrect');
      error.statusCode = 422;
      throw error;
    }

    const categoryId = req.params.categoryId;

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const type = req.query.type || 'work';

    const offSet = (page - 1) * limit;

    if (type === 'work') {
      const city = req.body.city;
      const state = req.body.state;
      const minBudget = req.body.minBudget;
      const projects = await Project.getFilteredProjects(
        categoryId,
        state,
        city,
        minBudget,
        offSet,
        limit
      );
      if (projects.length === 0) {
        const error = new Error(
          'No active project available of this category!'
        );
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(projects);
    }

    /**
     * will be modified in future
     */
    if (type === 'hire') {
      const users = await User.fetchAUsers(offSet, limit);
      res.status(200).json(users);
    }
  } catch (err) {
    next(err);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    const project = await Project.getProjectById(projectId);
    const proposals = await Proposal.getProposalsByProjectId(projectId);

    project.proposals = proposals;

    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
};

exports.getProposal = async (req, res, next) => {
  try {
    const proposalId = req.params.proposalId;

    const proposal = await Proposal.getProposalById(proposalId);

    res.status(200).json(proposal);
  } catch (err) {
    next(err);
  }
};

exports.createProposal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.body.userId;
    const projectId = req.body.projectId;
    const proposalDescription = req.body.proposalDescription;
    const proposedAmount = req.body.proposedAmount;

    const proposalCheck = await Proposal.checkProposalExist(userId, projectId);
    if (proposalCheck) {
      const error = new Error(
        'Yoh have already send proposal to this project!'
      );
      error.statusCode = 400;
      throw error;
    }
    const proposal = new Proposal(
      userId,
      projectId,
      proposalDescription,
      proposedAmount
    );

    await proposal.save();
    User.decreaseAllowedBids(userId);
    res.status(200).json({ message: 'Proposal Created!' });
  } catch (err) {
    next(err);
  }
};

exports.getBids = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.params.userId;

    const allowedBids = await User.getBids(userId);

    if (!allowedBids) {
      const error = new Error('No Bids found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(allowedBids);
  } catch (err) {
    next(err);
  }
};
