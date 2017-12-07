'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const cfg = require('../config');
const Twilio = require('twilio');

const ReminderSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  notification: Number,
  timeZone: String,
  time: {type: Date, index: true},
});

ReminderSchema.methods.requiresNotification = function(date) {
  return Math.round(moment.duration(moment(this.time).tz(this.timeZone).utc()
                          .diff(moment(date).utc())
                        ).asMinutes()) === this.notification;
};

ReminderSchema.statics.sendNotifications = function(callback) {
  // now
  const searchDate = new Date();
  Reminder
    .find()
    .then(function(reminders) {
      reminders = reminders.filter(function(reminder) {
              return reminder.requiresNotification(searchDate);
      });
      if (reminders.length > 0) {
        sendNotifications(reminders);
      }
    });

    /**
    * Send messages to all appoinment owners via Twilio
    * @param {array} reminders List of reminders.
    */
    function sendNotifications(reminders) {
        const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
        reminders.forEach(function(reminder) {
            // Create options to send the message
            const options = {
                to: `+ ${reminder.phoneNumber}`,
                from: cfg.twilioPhoneNumber,
                /* eslint-disable max-len */
                body: `Hi ${reminder.name}. Medication Alert from Mi-Amigx!.`,
                /* eslint-enable max-len */
            };

            // Send the message!
            client.messages.create(options, function(err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = reminder.phoneNumber.substr(0,
                        reminder.phoneNumber.length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                }
            });
        });

        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
          callback.call();
        }
    }
};


const Reminder = mongoose.model('reminder', ReminderSchema);
module.exports = Reminder;
