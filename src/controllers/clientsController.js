const models = require('../models');
const Sequelize = require('sequelize');
const HttpStatus = require('http-status-codes');
const Op = Sequelize.Op;

module.exports = {
    // Obtener todos los clientes junto con sus joins
    getAllClients (req, res, next) {

        models.clients.findAll({

            include: [
            {
                model: models.users,
                as: 'users',
                require: true
            },
            {
                model: models.invoices,
                as: 'invoices',
                require: true
            },
        ],
            order: [
                ['cliName', 'ASC'],

            ],
        })
            .then((clients) => {
                    if (clients.length > 0 ) {
                        res.status(HttpStatus.OK).json(clients);
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
    // Obtener clientes by id
    getClientsById(req, res, next) {

        models.clients.findAll({
            where: {
                cliId: {
                    [Op.like]: req.params.id
                },
            },
            include: [
                {
                    model: models.users,
                    as: 'users',
                    require: true
                },
                {
                    model: models.invoices,
                    as: 'invoices',
                    require: true
                },
            ],
            order: [
                ['cliName', 'ASC'],

            ],
        })
            .then((clients) => {
                if (clients.length > 0) {
                   let type = "success";
                    res.status(HttpStatus.OK).json(clients);
                } else {
                   let type = "Not Data";
                    res.status(HttpStatus.OK).json(clients);
                }
            }, (err) => {
                console.dir(err);
                let message = "Error interno del servidor";
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },
    // anhadir
    addClients(req, res, next) {
        models.clients.create({
            cliName: req.body.cliName

        })
            .then((clients) => {
                type = "success";
                res.status(HttpStatus.OK).json(clients);
            }, (err) => {
                console.dir(err);
                message = 'Error interno del servidor';
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },
    // Editar
    updateClients(req,res,next) {

        models.clients.findOne({
            where: {
                cliId: req.params.id
            }
        })
            .then((clients) => {
                if (clients) {
                    clients.update({

                        cliName: (req.body.cliName != null) ? req.body.cliName : clients.cliName,


                    })
                        .then((clients) => {
                            type = "success";
                            res.status(HttpStatus.OK).json(clients);
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
    // Borrar
    deleteClients(req,res,next) {

        models.clients.destroy({
            where: {
                cliId: req.params.id
            }
        })
            .then((clients) => {
                type = "success";
                res.status(HttpStatus.OK).json(clients);
            }, (err) => {
                message = 'Not data';
                res.status(HttpStatus.NOT_FOUND).json(message);
                next(err);
            });
    },

};