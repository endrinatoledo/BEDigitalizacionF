const express = require('express');
const emailInfoRouter = express.Router();
const emailInfoController = require('../controllers/emailInfoController');

const emailInfoByClient = '/emailInfoByClient/:id';
emailInfoRouter.route(emailInfoByClient)
    .get(emailInfoController.getAllByClient);

module.exports = emailInfoRouter;