//npm requires
const express = require('express')
const sendEmailController = require('../controllers/sendEmailController');
//Initializations
const sendEmailRouter = express.Router()


const uriSendEmail = '/sendEmail';
const uriSendEmailByBatch = '/sendEmailByBatch';
const urMultiFileEmail = '/multiFileEmail';

sendEmailRouter.route(uriSendEmail)
    .post(sendEmailController.sendEmail)
sendEmailRouter.route(urMultiFileEmail)
    .post(sendEmailController.multiFileEmail)
sendEmailRouter.route(uriSendEmailByBatch)
    .post(sendEmailController.sendByBatch)
module.exports = sendEmailRouter
