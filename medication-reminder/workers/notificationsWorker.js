'use strict';

const Reminder = require('../models/reminder');

const notificationWorkerFactory = function() {
  return {
    run: function() {
      Reminder.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();
