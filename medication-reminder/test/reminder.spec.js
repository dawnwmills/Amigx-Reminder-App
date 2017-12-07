'use strict';

require('./connectionHelper');
const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../app.js');
const Reminder = require('../models/reminder');
const agent = supertest(app);

describe('reminder', function() {
  let reminder = {};

  beforeEach(function(done) {
    Reminder.remove({}, done);
    reminder = new Reminder({
      name: 'Reminder',
      phoneNumber: '+5555555',
      time: new Date(),
      notification: 15,
      timeZone: 'Africa/Algiers',
    });
  });


  describe('GET /reminders', function() {
      it('list all reminders', function(done) {
        const result = reminder.save();
        result
          .then(function() {
            agent
              .get('/reminders')
              .expect(function(response) {
                expect(response.text).to.contain('Reminder');
                expect(response.text).to.contain('+5555555');
                expect(response.text).to.contain('15');
                expect(response.text).to.contain('Africa/Algiers');
              })
              .expect(200, done);
          });
      });
    });

  describe('GET /reminders/create', function() {
    it('shows create property form', function(done) {
      agent
        .get('/reminders/create')
        .expect(function(response) {
          expect(response.text).to.contain('Create');
        })
        .expect(200, done);
    });
  });

  describe('POST to /reminders', function() {
    it('creates a new reminder', function(done) {
      agent
        .post('/reminders')
        .type('form')
        .send({
          name: 'Reminder',
          phoneNumber: '+5555555',
          time: '02-17-2016 12:00am',
          notification: 15,
          timeZone: 'Africa/Algiers',
        })
        .expect(function(res) {
          Reminder
            .find({})
            .then(function(reminders) {
              expect(reminders.length).to.equal(1);
            });
        })
        .expect(302, done);
    });
  });


  describe('GET /reminders/:id/edit', function() {
  it('shows a single reminder', function(done) {
    const result = reminder.save();
    result
      .then(function() {
        agent
          .get('/reminders/' + reminder.id + '/edit')
          .expect(function(response) {
            expect(response.text).to.contain('Reminder');
            expect(response.text).to.contain('+5555555');
            expect(response.text).to.contain('15');
            expect(response.text).to.contain('Africa/Algiers');
          })
          .expect(200, done);
      });
    });
  });

  describe('POST /reminders/:id/edit', function() {
    it('updates an reminder', function(done) {
      const result = reminder.save();
      result
        .then(function() {
          agent
            .post('/reminders/' + reminder.id + '/edit')
            .type('form')
            .send({
              name: 'Reminder2',
              phoneNumber: '+66666666',
              time: '02-17-2016 12:00am',
              notification: 15,
              timeZone: 'Africa/Algiers',
            })
            .expect(function(response) {
              Reminder
                .findOne()
                .then(function(reminder) {
                  expect(reminder.name).to.contain('Reminder2');
                  expect(reminder.phoneNumber).to.contain('+66666666');
                });
            })
            .expect(302, done);
        });
    });
  });
});
