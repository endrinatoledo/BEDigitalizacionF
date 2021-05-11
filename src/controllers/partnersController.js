const models = require('../models');
const Sequelize = require('sequelize');
const HttpStatus = require('http-status-codes');
const Op = Sequelize.Op;

module.exports = {
    // Obtener todos los prtentes junto con sus joins
    getAllpartners (req, res, next) {

        models.partners.findAll({

            include: [
            {
                model: models.invoices,
                as: 'invoices',
                require: true,
                group: ['cli_id'],
                include: [
                    {
                        model: models.clients,
                        as: 'clients',
                        require: true
                    },
                ]
            },
        ],
            group: ['prtId'],
            order: [
                ['prtName', 'ASC'],

            ],
        })
            .then((partners) => {
                    if (partners.length > 0 ) {
                        res.status(HttpStatus.OK).json(partners);
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
    getAllpartnersBySeller (req, res, next) {

        models.partners.findAll({
            include: [
            {
                model: models.invoices,
                as: 'invoices',
                where:{
                    invSeller: req.params.id
                },
                require: true,
                group: ['cli_id'],
                include: [
                    {
                        model: models.clients,
                        as: 'clients',
                        require: true
                    },
                ]
            },
        ],
            group: ['prtId'],
            order: [
                ['prtName', 'ASC'],

            ],
        })
            .then((partners) => {
                    if (partners.length > 0 ) {
                        res.status(HttpStatus.OK).json(partners);
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
    // Obtener prtentes by id
    getpartnersById(req, res, next) {

        models.partners.findAll({
            where: {
                prtId: {
                    [Op.like]: req.params.id
                },
            },
            include: [
                {
                    model: models.invoices,
                    as: 'invoices',
                    require: true
                },
            ],
            order: [
                ['prtName', 'ASC'],

            ],
        })
            .then((partners) => {
                if (partners.length > 0) {
                   let type = "success";
                    res.status(HttpStatus.OK).json(partners);
                } else {
                   let type = "Not Data";
                    res.status(HttpStatus.OK).json(partners);
                }
            }, (err) => {
                console.dir(err);
                let message = "Error interno del servidor";
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },
    // anhadir
    addpartners(req, res, next) {
        models.partners.create({
            prtName: req.body.prtName,
            prtEmail: req.body.prtEmail,
            prtKey: req.body.prtKey
        })
            .then((partners) => {
                type = "success";
                res.status(HttpStatus.OK).json(partners);
            }, (err) => {
                console.dir(err);
                message = 'Error interno del servidor';
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                next(err);
            });
    },
    // Editar
    updatepartners(req,res,next) {

        models.partners.findOne({
            where: {
                prtId: req.params.id
            }
        })
            .then((partners) => {
                if (partners) {
                    partners.update({

                        prtName: (req.body.prtName != null) ? req.body.prtName : partners.prtName,
                        prtEmail: (req.body.prtEmail != null) ? req.body.prtEmail : partners.prtEmail,
                        prtKey: (req.body.prtKey != null) ? req.body.prtKey : partners.prtKey
                        
                    })
                        .then((partners) => {
                            type = "success";
                            res.status(HttpStatus.OK).json(partners);
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
    deletepartners(req,res,next) {

        models.partners.destroy({
            where: {
                prtId: req.params.id
            }
        })
            .then((partners) => {
                type = "success";
                res.status(HttpStatus.OK).json(partners);
            }, (err) => {
                message = 'Not data';
                res.status(HttpStatus.NOT_FOUND).json(message);
                next(err);
            });
    },

};