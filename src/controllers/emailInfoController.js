const models = require('../models');
const Sequelize = require('sequelize');
const HttpStatus = require('http-status-codes');
const Op = Sequelize.Op;

module.exports = {
    getAllByClient (req, res, next) {
        let response = [];
        models.email_readed.findAll({
            where: {
                cliId: req.params.id
            },
        })
            .then(async (data) => {
                    if (data.length > 0 ) {
                        for (let index = 0; index < data.length; index++) {
                            response.push({
                                ...data[index], 
                                child: await models.email_details.findAll({
                                    where: {
                                        erId: data[index].erId
                                    },
                                }) 
                            })
                        }
                        res.status(HttpStatus.OK).json(response);
                    } else {
                        res.status(HttpStatus.OK).json(response);
                    }
                }, (err) => {
                    console.dir(err);
                   let message = "Error interno del servidor";
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(message);
                    next(err);
                }
            );
    },
};