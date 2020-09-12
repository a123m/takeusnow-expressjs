const fetch = require('node-fetch');
const { validationResult } = require('express-validator');

const User = require('../modals/user');

exports.sendToAll = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is incorrect');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const body = req.body.body;
    // const topic = req.body.topic;

    const notification = {
      title: title,
      body: body,
    };
    const fcm_tokens = [
      'eylF7KxLN7Y:APA91bGDhgY6vZkh44kUUlPq_KyBOQxjql-J7Rc2uoBMXQMHi5sKO6pnc2TBow3z055yG_geM-bzI4BiyqE3W9CvN8UKr_8NTYQiuUr2L4CHlmkgm6ZKHwx2MJrwmLG026nNu4oJw8f7',
    ];

    const notification_body = {
      // to: '/topics/' + topic,
      notification: notification,
      registration_ids: fcm_tokens,
    };

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization:
          'key=' +
          'AAAAIME4zrg:APA91bEL1FXkRXnfYsEtRAjTJpLG1p5JYruHMVR77oqjBMjQEQCNe8oGQykJ7oXGhCtMLUuaBV8NI4ORqypSQ7bGOYZFw9iO5Q_mibiDr8YrCHfhYSmHwwkatUTq5lYDy3YYzMQgUefD',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification_body),
    });

    if (!response) {
      const error = new Error('Notification send fail!');
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.sendToUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Entered Data is incorrect');
      error.statusCode = 422;
      throw error;
    }

    const userId = req.body.userId;
    const title = req.body.title;
    const body = req.body.body;

    const notification = {
      title: title,
      body: body,
    };

    const user = await User.fetchAllById(userId);

    const fcm_tokens = [];
    fcm_tokens.push(user.fcm_token);

    const notification_body = {
      notification: notification,
      registration_ids: fcm_tokens,
    };

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization:
          'key=' +
          'AAAAIME4zrg:APA91bEL1FXkRXnfYsEtRAjTJpLG1p5JYruHMVR77oqjBMjQEQCNe8oGQykJ7oXGhCtMLUuaBV8NI4ORqypSQ7bGOYZFw9iO5Q_mibiDr8YrCHfhYSmHwwkatUTq5lYDy3YYzMQgUefD',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification_body),
    });

    if (!response) {
      const error = new Error('Notification send fail!');
      error.statusCode = 400;
      throw error;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
