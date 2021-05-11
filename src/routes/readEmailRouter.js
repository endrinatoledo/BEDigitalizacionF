const express = require('express');
const readEmailRouter = express.Router();
const readEmailController = require('../controllers/readEmailController');

const uriReadEmail = '/readEmail/';//Search from email
const uriReadEmails = '/readEmails/';//Get all
const uriCheck = '/checkEmails/';//Get all

readEmailRouter.route(uriReadEmail)
    .post(readEmailController.getEmail)
readEmailRouter.route(uriReadEmails)
    .get(readEmailController.getEmails)
readEmailRouter.route(uriCheck)
    .get(readEmailController.checkFails)

module.exports = readEmailRouter;