const fetch = require('node-fetch');

exports.sendNotification = async (title, body, fcmToken) => {
  const notification = {
    title: title,
    body: body,
  };

  const notification_body = {
    to: fcmToken,
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

  return response;
};
