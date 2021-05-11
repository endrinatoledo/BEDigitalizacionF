const models = require('../models');

module.exports = {
    async getConfig (req, res, next) {
        const cliId = req.params.id
        const data = (await models.configs.findOne({ where: { cliId: cliId } }))
        res.json(data == null ? {} : data)
        },
    async updateConfig (req, res, next) {
        models.configs.findOne({
            where: {
                cliId: req.params.id
            }
        })
            .then((configs) => {
                if (configs) {
                    configs.update({

                        cfgInvPrefix: (req.body.cfgInvPrefix != null) ? req.body.cfgInvPrefix : configs.cfgInvPrefix,
                        cfgCtrlPrefix: (req.body.cfgCtrlPrefix != null) ? req.body.cfgCtrlPrefix : configs.cfgCtrlPrefix,
                        cfgPrinterEmail: (req.body.cfgPrinterEmail != null) ? req.body.cfgPrinterEmail : configs.cfgPrinterEmail

                    })
                        .then((configs) => {
                            type = "success";
                            res.json(configs);
                        }, (err) => {
                            console.dir(err);
                            message = 'Error interno del servidor';
                            res.status(500).json(message);
                            next(err);
                        });
                }
            }, (err) => {
                message = 'Not data';
                res.status(HttpStatus.NOT_FOUND).json(message);
                next(err);
            });
        }
    }