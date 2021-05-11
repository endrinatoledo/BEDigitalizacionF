const express = require('express');

//init
const syncClientDataRouter = express.Router();
const syncClientDataController = require('../controllers/syncClientDataController');


const uriSyncClientData = '/syncClientData';

syncClientDataRouter.route(uriSyncClientData)
    .get(syncClientDataController.syncPartners);


module.exports = syncClientDataRouter;