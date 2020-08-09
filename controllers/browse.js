const { validationResult } = require('express-validator');

const User = require('../modals/user');
const Project = require('../modals/project');
const Proposal = require('../modals/proposal');

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

      const projectData = await Project.getFilteredProjects(
        state,
        city,
        minBudget,
        offSet,
        limit
      );
      if (!projectData) {
        const error = new Error('Profile Data Not Found');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(projectData);
    }

    /**
     * wiil be modified in future
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const projectId = req.params.projectId;

    const result = Project.getProjectByIdWithProposals(projectId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getProposal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const proposalId = req.params.proposalId;

    const result = await Proposal.getProposalById(proposalId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateProposal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is Incorrect');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const proposalId = req.body.proposalId;
    const projectId = req.body.projectId;
    const status = req.body.status;

    await Proposal.updateProposalStatus(proposalId, status);
    await Project.updateProjectStatus(projectId, status);

    res.status(200).json({ message: 'Project accepted' });
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
    const proposedPrice = req.body.proposedPrice;
    const description = req.body.description;
    // const createdAt = req.body.createdAt;
    const status = req.body.status;

    const userData = User.fetchAllById(userId);
    const fullName = userData.fname.concat(' ', userData.lname);
    /**
     * always create new object with new data to store in DB
     */
    const proposal = new Proposal(
      projectId,
      userId,
      fullName,
      proposedPrice,
      description,
      // createdAt,
      status
    );

    const result = await proposal.save();

    res
      .status(200)
      .json({ message: 'Proposal Created!', proposalId: result[0].insertId });
  } catch (err) {
    next(err);
  }
};
