const express = require('express');
const batchRouter = express.Router();
const batchController = require('../controllers/batchController');

const AllbatchsByClientID = '/allBatchsByClient/:id';
const batchsToSendByClientID = '/batchsToSendByClient/:id';
const uriBatchsId = '/batchs/:id';
batchRouter.route(AllbatchsByClientID)
    .get(batchController.getAllBatchsByClient);
batchRouter.route(batchsToSendByClientID)
    .get(batchController.getToSendBatchsByClient);
batchRouter.route(uriBatchsId)
    .put(batchController.updateBatchs)

module.exports = batchRouter;