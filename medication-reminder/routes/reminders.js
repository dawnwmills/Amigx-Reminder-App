'use strict';

const express = require('express');
const momentTimeZone = require('moment-timezone');
const moment = require('moment');
const Reminder = require('../models/reminder');
const router = new express.Router();


const getTimeZones = function() {
  return momentTimeZone.tz.names();
};

// GET: /reminders
router.get('/', function(req, res, next) {
  Reminder.find()
    .then(function(reminders) {
      res.render('reminders/index', {reminders: reminders});
    });
});

// GET: /reminders/create
router.get('/create', function(req, res, next) {
  res.render('reminders/create', {
    timeZones: getTimeZones(),
    reminder: new Reminder({name: '',
                                  phoneNumber: '',
                                  notification: '',
                                  timeZone: '',
                                  time: ''})});
});

// POST: /reminders
router.post('/', function(req, res, next) {
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const notification = req.body.notification;
  const timeZone = req.body.timeZone;
  const time = moment(req.body.time, 'MM-DD-YYYY hh:mma');

  const reminder = new Reminder({name: name,
                                       phoneNumber: phoneNumber,
                                       notification: notification,
                                       timeZone: timeZone,
                                       time: time});
  reminder.save()
    .then(function() {
      res.redirect('/');
    });
});

// GET: /reminders/:id/edit
router.get('/:id/edit', function(req, res, next) {
  const id = req.params.id;
  Reminder.findOne({_id: id})
    .then(function(reminder) {
      res.render('reminders/edit', {timeZones: getTimeZones(),
                                       reminder: reminder});
    });
});

// POST: /reminders/:id/edit
router.post('/:id/edit', function(req, res, next) {
  const id = req.params.id;
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const notification = req.body.notification;
  const timeZone = req.body.timeZone;
  const time = moment(req.body.time, 'MM-DD-YYYY hh:mma');

  Reminder.findOne({_id: id})
    .then(function(reminder) {
      reminder.name = name;
      reminder.phoneNumber = phoneNumber;
      reminder.notification = notification;
      reminder.timeZone = timeZone;
      reminder.time = time;

      reminder.save()
        .then(function() {
          res.redirect('/');
        });
    });
});

// POST: /reminders/:id/delete
router.post('/:id/delete', function(req, res, next) {
  const id = req.params.id;

  Reminder.remove({_id: id})
    .then(function() {
      res.redirect('/');
    });
});

module.exports = router;