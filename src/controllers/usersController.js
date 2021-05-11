const models = require('../models');
const Sequelize = require('sequelize');
const HttpStatus = require('http-status-codes');
const Op = Sequelize.Op;

module.exports = {

    getAllUser (req, res, next) {

        models.users.findAll({

            include: [
                {
                    model: models.clients,
                    as: 'clients',
                    require: true
                },
            ],
            order: [
                ['usrName', 'ASC'],

            ],
        })
            .then((users) => {
                    if (users.length > 0 ) {
                        res.status(HttpStatus.OK).json(users);
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

    getUsersById(req, res, next) {

        models.users.findAll({
            where: {
                usrId: {
                    [Op.like]: req.params.id
                },
            },
            include: [
                {
                    model: models.clients,
                    as: 'clients',
                    require: true
                },
            ],
            order: [
                ['usrName', 'ASC'],

            ],
        })
            .then((users) => {
                if (users.length > 0) {
                    let type = "success";
                    res.status(HttpStatus.OK).json(users);
                } else {
                    let type = "Not Data";
                    res.status(HttpStatus.OK).json(users);
                }
            }, (err) => {
                console.dir(err);
                let message = "Error interno del servidor";
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },
    getUsersByEmail(req, res, next) {

        models.users.findAll({
            where: {
                usrEmail: {
                    [Op.like]: req.params.email
                },
            },
            include: [
                {
                    model: models.clients,
                    as: 'clients',
                    require: true
                },
            ],
            order: [
                ['usrName', 'ASC'],

            ],
        })
            .then((users) => {
                if (users.length > 0) {
                    let type = "success";
                    res.status(HttpStatus.OK).json(users);
                } else {
                    let type = "Not Data";
                    res.status(HttpStatus.OK).json(users);
                }
            }, (err) => {
                console.dir(err);
                let message = "Error interno del servidor";
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },
    addUsers(req, res, next) {
        models.users.create({
            usrName: req.body.usrName,
            usrLastName: req.body.usrLastName,
            usrEmail: req.body.usrEmail,
            usrRol: req.body.usrRol,
            usrStatus: req.body.usrStatus,
            cliId: req.body.cliId,
            usrSellerCode: req.body.usrSellerCode

        })
            .then((users) => {
                type = "success";
                res.status(HttpStatus.OK).json(users);
            }, (err) => {
                console.dir(err);
                message = 'Error interno del servidor';
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },

    updateUsers(req,res,next) {

        models.users.findOne({
            where: {
                usrId: req.params.id
            }
        })
            .then((users) => {
                if (users) {
                    users.update({

                        usrName: (req.body.usrName != null) ? req.body.usrName : users.usrName,
                        usrLastName: (req.body.usrLastName != null) ? req.body.usrLastName : users.usrLastName,
                        usrEmail: (req.body.usrEmail != null) ? req.body.usrEmail : users.usrEmail,
                        usrRol: (req.body.usrRol != null) ? req.body.usrRol : users.usrRol,
                        usrStatus: (req.body.usrStatus != null) ? req.body.usrStatus : users.usrStatus,
                        cliId: (req.body.cliId != null) ? req.body.cliId : users.cliId,
                        usrSellerCode: (req.body.usrSellerCode != null) ? req.body.usrSellerCode : users.usrSellerCode,

                    })
                        .then((users) => {
                            type = "success";
                            res.status(HttpStatus.OK).json(users);
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

    deleteUsers(req, res, next) {

        models.users.destroy({
            where: {
                usrId: req.params.id
            }
        })
            .then((users) => {
                type = "success";
                res.status(HttpStatus.OK).json(users);
            }, (err) => {
                message = 'Not data';
                res.status(HttpStatus.NOT_FOUND).json(message);
                next(err);
            });
    },



};