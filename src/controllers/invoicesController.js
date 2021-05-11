const models = require('../models');
const Sequelize = require('sequelize');
const HttpStatus = require('http-status-codes');
const Op = Sequelize.Op;

module.exports = {
    getInvoices2ByClient (req, res, next) {
        models.invoices_mirror.findAll({
            where:{
                cliId: req.params.id,
                invSended: null
            },
            include:[
                {
                    model: models.clients,
                    as: 'clients'
                },{
                    model: models.partners,
                    as: 'partners'
                }],
            order: [
                ['invZone', 'ASC'],

            ],
        })
            .then((invoices) => {
                    if (invoices.length > 0 ) {
                        res.status(HttpStatus.OK).json(invoices);
                    } else {
                        let type=[];
                        res.status(HttpStatus.OK).json(type);
                    }
                }, (err) => {
                    console.log(err);
                    let message = "Error interno del servidor";
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                    next(err);
                }
            );
    },
    getInvoicesByBatch (req, res, next) {
        models.invoices.findAll({
            where:{
                bthId: req.params.id
            },
            include:[
                {
                    model: models.clients,
                    as: 'clients'
                },{
                    model: models.partners,
                    as: 'partners'
                }],
            order: [
                ['invZone', 'ASC'],

            ],
        })
            .then((invoices) => {
                    if (invoices.length > 0 ) {
                        res.status(HttpStatus.OK).json(invoices);
                    } else {
                        let type="Not Data";
                        res.status(HttpStatus.OK).json(type);
                    }
                }, (err) => {
                    console.log(err);
                    let message = "Error interno del servidor";
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                    next(err);
                }
            );
    },
    getAllInvoices (req, res, next) {
        models.invoices.findAll({
            include:[
                {
                    model: models.clients,
                    as: 'clients'
                },{
                    model: models.partners,
                    as: 'partners'
                }],
            order: [
                ['invZone', 'ASC'],

            ],
        })
            .then((invoices) => {
                    if (invoices.length > 0 ) {
                        res.status(HttpStatus.OK).json(invoices);
                    } else {
                        let type="Not Data";
                        res.status(HttpStatus.OK).json(type);
                    }
                }, (err) => {
                    console.log(err);
                    let message = "Error interno del servidor";
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                    next(err);
                }
            );
    },
    getInvoicesById(req, res, next) {

        models.invoices.findAll({
            where: {
                invId: req.params.id
            },
            order: [
                ['invZone', 'ASC'],

            ],
        })
            .then((invoices) => {
                if (invoices.length > 0) {
                    let type = "success";
                    res.status(HttpStatus.OK).json(invoices);
                } else {
                    let type = "Not Data";
                    res.status(HttpStatus.OK).json(invoices);
                }
            }, (err) => {
                console.dir(err);
                let message = "Error interno del servidor";
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },

    getInvoicesByinvNumber(req, res, next) {

        models.invoices.findAll({
            where: {
                invNumber: {
                    [Op.like]: req.params.inv
                },
            },
            order: [
                ['invZone', 'ASC'],

            ],
        })
            .then((invoices) => {
                if (invoices.length > 0) {
                    let type = "success";
                    res.status(HttpStatus.OK).json(invoices);
                } else {
                    let type = "Not Data";
                    res.status(HttpStatus.OK).json(invoices);
                }
            }, (err) => {
                console.dir(err);
                let message = "Error interno del servidor";
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },

    addInvoices(req, res, next) {
        models.invoices.create({
            invNumber: req.body.invNumber,
            invControlNumber: req.body.invControlNumber,
            invZone: req.body.invZone,
            invSeller: req.body.invSeller,
            invTrip: req.body.invTrip,
            cliId: req.body.cliId,
            fileRoute: req.body.fileRoute

        })
            .then((invoices) => {
                type = "success";
                res.status(HttpStatus.OK).json(invoices);
            }, (err) => {
                console.dir(err);
                message = 'Error interno del servidor';
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },

    updateInvoices(req,res,next) {

        models.invoices.findOne({
            where: {
                invId: req.params.id
            }
        })
            .then((invoices) => {
                if (invoices) {
                    invoices.update({

                        invNumber: (req.body.invNumber != null) ? req.body.invNumber : invoices.invNumber,
                        invControlNumber: (req.body.invControlNumber != null) ? req.body.invControlNumber : invoices.invControlNumber,
                        invZone: (req.body.invZone != null) ? req.body.invZone : invoices.invZone,
                        invSeller: (req.body.invSeller != null) ? req.body.invSeller : invoices.invSeller,
                        invTrip: (req.body.invTrip != null) ? req.body.invTrip : invoices.invTrip,
                        cliId: (req.body.cliId != null) ? req.body.cliId : invoices.cliId,
                        fileRoute: (req.body.fileRoute != null) ? req.body.fileRoute : invoices.fileRoute,
                        invSended: (req.body.invSended != null) ? req.body.invSended : invoices.invSended


                    })
                        .then((invoices) => {
                            type = "success";
                            res.status(HttpStatus.OK).json(invoices);
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

    deleteInvoices(req, res, next) {

        models.invoices.destroy({
            where: {
                invId: req.params.id
            }
        })
            .then((invoices) => {
                type = "success";
                res.status(HttpStatus.OK).json(invoices);
            }, (err) => {
                message = 'Not data';
                res.status(HttpStatus.NOT_FOUND).json(message);
                next(err);
            });
    },

};