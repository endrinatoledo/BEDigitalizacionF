const models = require('../models');
const emailValidator = require("email-validator");
const creator = require('axios');
const axios = creator.create({
	baseURL: process.env.BASE_API + ":" +process.env.PORT + "/api/v1"
  });
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
module.exports = {
    async sortInvoices (req, res, next) {
        const { cliId, min, max } = req.body
        const config = (await models.configs.findOne({ where: { cliId: cliId } }))
        const client = (await models.clients.findOne({ where: { cliId: cliId } }))
        const batchs = await models.batchs.create({
            bthSended: "false",
            cliId: cliId,
            initInv : config.cfgInvPrefix + pad(min, 8),
            lastInv: config.cfgInvPrefix + pad(max, 8)
        })
        let data= [], i = 0;
        for (let index = min; index < (max+1); index++) {
            data.push({ invNumber: config.cfgInvPrefix + pad(index, 8), data: await models.invoices_mirror.findOne({
                where:{
                    invNumber: config.cfgInvPrefix + pad(index, 8),
                    cliId: cliId 
                },
                include:[
                    {
                        model: models.clients,
                        as: 'clients'
                    },{
                        model: models.partners,
                        as: 'partners'
                    }]
            })})
            let order, clientData, prt;
            order = (await axios.get('/db2/getFactByNum/' + client.cliName + '?factNum=' + index)).data.results
            clientData = (await axios.get('/db2/getClientEmail/' + client.cliName + '?clientKey=' + order.clientKey )).data.results[0];
            await models.partners.findOne({ where: {prtKey: order.clientKey }  })
                .then(async function(obj) {
                // update
                if(obj){
                    await obj.update({
                        prtName: clientData.NAME,
                        prtEmail: emailValidator.validate(clientData.EXT_EMAIL) ? clientData.EXT_EMAIL : 'null',
                        prtKey: order.clientKey
                    });
                }else{
                    
                    // insert
                    await models.partners.create({
                        prtName: clientData.NAME,
                        prtEmail: emailValidator.validate(clientData.EXT_EMAIL) ? clientData.EXT_EMAIL : 'null',
                        prtKey: order.clientKey
                    });
                }
                prt = await models.partners.findOne({ where: {prtKey: order.clientKey }  });
                if(data[i].data != null){
                    if(await models.invoices.findOne({ where: { invNumber: data[i].data.invNumber, cliId: cliId } })){
                        duplicated = true;
                    }else{
                        await models.invoices.create({
                            invNumber: data[i].invNumber,
                            cliId: cliId,
                            prtId: prt.prtId,
                            invControlNumber: data[i].data.invControlNumber,
                            invZone: data[i].data.invZone,
                            invSeller: data[i].data.invSeller,
                            invTrip: data[i].data.invTrip ,
                            invOrder: order.NPEDVP,
                            fileRoute: data[i].data.fileRoute,
                            invReleaseDate: data[i].data.invReleaseDate,
                            bthId: batchs.bthId,
                            readError: "false"
                            })
                    }
                    await models.invoices_mirror.update({
                        invSended: 'true'
                    },{where:{invId: data[i].data.invId}});
                }else{
                    if(await models.invoices.findOne({ where: { invNumber: data[i].invNumber, cliId: cliId } })){
                        duplicated = true;
                    }else{
                        
                        await models.invoices.create({
                            invNumber: data[i].invNumber,
                            cliId: cliId,
                            prtId: prt.prtId,
                            invOrder: order.NPEDVP,
                            bthId: batchs.bthId,
                            readError: "true"
                            })
                    }
                }
                return 'yes'
                })
                i++;

            }
        await axios.post('/sendEmailByBatch', { bthId: batchs.bthId })
            res.json({data})
        }
    }