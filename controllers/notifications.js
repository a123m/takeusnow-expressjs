const fetch = require('node-fetch');
const { validationResult } = require('express-validator');

const User = require('../models/user');

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
    const fcm_tokens = [];

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

    const notification_body = {
      to: user.fcm_token,
      notification: notification,
      android: {
        notification: {
          image: 'https://picsum.photos/200/300',
        },
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
          },
        },
        fcm_options: {
          image: 'https://picsum.photos/200/300',
        },
      },
      webpush: {
        headers: {
          image: 'https://picsum.photos/200/300',
        },
      },
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
