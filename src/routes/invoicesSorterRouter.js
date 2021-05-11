const express = require('express');
const InvoicesSorterRouter = express.Router();
const invoicesSorterController = require('../controllers/invoicesSorterController');

const uriSortInvoices = '/sortInvoices';


InvoicesSorterRouter.route(uriSortInvoices)
    .post(invoicesSorterController.sortInvoices);


module.exports = InvoicesSorterRouter;