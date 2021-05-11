const express = require('express');

//init
const db2InvoicesRouter = express.Router();
const db2InvoicesController = require('../controllers/db2InvoicesController');


const uriDb2InvoicesClientBs = '/db2/getFactByNumBs/:client';
const uriDb2InvoicesClientUsd = '/db2/getFactByNumUsd/:client';
const uriDb2InvoicesEmail = '/db2/getClientEmail/:client';
const uriDb2SellerEmail= '/db2/getSellerEmail/:client';

db2InvoicesRouter.route(uriDb2InvoicesClientBs)
    .get(db2InvoicesController.getFactByNumBs);
db2InvoicesRouter.route(uriDb2InvoicesClientUsd)
    .get(db2InvoicesController.getFactByNumUsd);

db2InvoicesRouter.route(uriDb2InvoicesEmail)
    .get(db2InvoicesController.getClientEmail);

db2InvoicesRouter.route(uriDb2SellerEmail)
    .get(db2InvoicesController.getSellerEmail);

module.exports = db2InvoicesRouter;