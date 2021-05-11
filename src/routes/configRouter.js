const express = require('express');
const configRouter = express.Router();
const configController = require('../controllers/configController');

const uriConfigByClientId = '/configByClientId/:id';

configRouter.route(uriConfigByClientId)
    .get(configController.getConfig)
    .put(configController.updateConfig)
    

module.exports = configRouter;