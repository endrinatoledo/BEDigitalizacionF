const express = require('express');
const clientsRouter = express.Router();
const clientsController = require('../controllers/clientsController');

const uriClients = '/clients';
const uriClientesId = '/clients/:id';


clientsRouter.route(uriClients)
    .get(clientsController.getAllClients)
    .post(clientsController.addClients);

clientsRouter.route(uriClientesId)
    .get(clientsController.getClientsById)
    .put(clientsController.updateClients)
    .delete(clientsController.deleteClients);

module.exports = clientsRouter;