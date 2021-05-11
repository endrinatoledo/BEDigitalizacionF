const express = require('express');
const invoicesRouter = express.Router();
const invoicesController = require('../controllers/invoicesController');

const uriInvoices = '/invoices';
const uriInvoicesId = '/invoices/:id';
const uriInvoicesInvNumber = '/invoices/inv/:inv';
const uriInvoicesBath = '/invoices/invoicesByBatch/:id'
const uriInvoices2 = '/donwloadByClient/:id'
invoicesRouter.route(uriInvoices)
    .get(invoicesController.getAllInvoices)
    .post(invoicesController.addInvoices);

invoicesRouter.route(uriInvoicesId)
    .get(invoicesController.getInvoicesById)
    .put(invoicesController.updateInvoices)
    .delete(invoicesController.deleteInvoices);

invoicesRouter.route(uriInvoicesInvNumber)
    .get(invoicesController.getInvoicesByinvNumber);

invoicesRouter.route(uriInvoicesBath)
    .get(invoicesController.getInvoicesByBatch);

invoicesRouter.route(uriInvoices2)
    .get(invoicesController.getInvoices2ByClient);

module.exports = invoicesRouter;