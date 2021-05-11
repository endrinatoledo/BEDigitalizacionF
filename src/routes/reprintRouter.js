const express = require('express');
const reprintRouter = express.Router();
const reprintController = require('../controllers/reprintController');

const uriReprint = '/reprint';


reprintRouter.route(uriReprint)
    .post(reprintController.sendReprint);


module.exports = reprintRouter;