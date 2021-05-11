const Sequelize = require('sequelize');
const models = require('../models');
//npm requires
const axios = require('axios');
axios.defaults.baseURL = process.env.BASE_API + ":" +process.env.PORT + "/api/v1";
//project require

//Exports
async function syncPartners(req, res, next){
    const partners = (await axios.get("/partners")).data
    let dataSource = []
    for (let index = 0; index < partners.length; index++) {
        dataSource = (await axios.get('/db2/getClientEmail/' + partners[index].invoices[0].clients.cliName + '?clientKey=' + partners[index].prtKey )).data.results;
        dataSource = dataSource[dataSource.length-1]
        await models.partners.findOne({ where: {prtId: partners[index].prtId} })
                    .then(async function(obj) {
                        await obj.update({
                            prtName: dataSource.NAME,
                            prtEmail: dataSource.EXT_EMAIL
                        });
                    });
    }
    res.json({partners: (await axios.get("/partners")).data})
}

module.exports = { syncPartners };
