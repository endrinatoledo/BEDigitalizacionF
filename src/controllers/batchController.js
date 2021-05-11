const models = require('../models');
const Sequelize = require('sequelize');
const HttpStatus = require('http-status-codes');
const Op = Sequelize.Op;

module.exports = {
    updateBatchs(req,res,next) {

        models.batchs.findOne({
            where: {
                bthId: req.params.id
            }
        })
            .then((batchs) => {
                if (batchs) {
                    batchs.update({

                        bthSended: (req.body.bthSended != null) ? req.body.bthSended : batchs.bthSended,


                    })
                        .then((batchs) => {
                            type = "success";
                            res.status(HttpStatus.OK).json(batchs);
                        }, (err) => {
                            console.dir(err);
                            message = 'Error interno del servidor';
                            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                            next(err);
                        });
                }
            }, (err) => {
                message = 'Not data';
                res.status(HttpStatus.NOT_FOUND).json(message);
                next(err);
            });
    },
    getAllBatchsByClient (req, res, next) {

        models.batchs.findAll({
            where: {
                cliId: req.params.id
            }
        })
            .then((batchs) => {
                    if (batchs.length > 0 ) {
                        res.status(HttpStatus.OK).json(batchs);
                    } else {
                       let type="Not Data";
                        res.status(HttpStatus.OK).json(type);
                    }
                }, (err) => {
                    console.dir(err);
                   let message = "Error interno del servidor";
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                    next(err);
                }
            );
    },
    getToSendBatchsByClient (req, res, next) {

        models.batchs.findAll({
            where: {
                cliId: req.params.id,
                bthSended: 'false'
            }
        })
            .then((batchs) => {
                    if (batchs.length > 0 ) {
                        res.status(HttpStatus.OK).json(batchs);
                    } else {
                       let type="Not Data";
                        res.status(HttpStatus.OK).json(type);
                    }
                }, (err) => {
                    console.dir(err);
                   let message = "Error interno del servidor";
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                    next(err);
                }
            );
    }
};