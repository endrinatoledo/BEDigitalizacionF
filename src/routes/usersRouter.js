const express = require('express');
const usersRouter = express.Router();
const usersController = require('../controllers/usersController');

const uriUsers = '/users';
const uriUsersId = '/users/:id';
const uriUsersEmail = '/usersEmail/:email';
usersRouter.route(uriUsers)
    .get(usersController.getAllUser)
    .post(usersController.addUsers);


usersRouter.route(uriUsersId)
    .get(usersController.getUsersById)
    .put(usersController.updateUsers)
    .delete(usersController.deleteUsers);
usersRouter.route(uriUsersEmail)
    .get(usersController.getUsersByEmail)

module.exports = usersRouter;