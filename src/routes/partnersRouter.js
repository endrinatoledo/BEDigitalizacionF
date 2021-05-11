const express = require('express');
const partnersRouter = express.Router();
const partnersController = require('../controllers/partnersController');

const uriPartners = '/partners';
const uriPartnersId = '/partners/:id';
const uriPartnersBySellerId = '/partnersBySeller/:id';

partnersRouter.route(uriPartners)
    .get(partnersController.getAllpartners)
    .post(partnersController.addpartners);

partnersRouter.route(uriPartnersId)
    .get(partnersController.getpartnersById)
    .put(partnersController.updatepartners)
    .delete(partnersController.deletepartners);

partnersRouter.route(uriPartnersBySellerId)
    .get(partnersController.getAllpartnersBySeller)

module.exports = partnersRouter;