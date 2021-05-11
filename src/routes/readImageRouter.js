const express = require('express');
const readImagesRouter = express.Router();
const readImagesController = require('../controllers/readImagesController');

const uriReadImages = '/readImages';


readImagesRouter.route(uriReadImages)
    .post(readImagesController.readImages);


module.exports = readImagesRouter;