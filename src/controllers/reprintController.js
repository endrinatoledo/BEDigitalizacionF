var soap = require('soap');
const models = require('../models');
const axios = require('axios');
axios.defaults.baseURL = process.env.BASE_API + ":" +process.env.PORT + "/api/v1";
const FebecaWsdl = process.env.FebecaWsdl;
const SillacaWsdl = process.env.SillacaWsdl;
const BevalWsdl = process.env.BevalWsdl;
function reprint (url, arg0, arg1) {
    console.log({url, arg0, arg1})
    /*soap.createClient(url, function (err, client) {
        if (err){
          throw err;
        }
      
        var args = {
          arg0: arg0, // Código del Cliente simple, valores numéricos de tamaño 7
          arg1: arg1  // Número del Pedido, máximo 10 caracteres
        };
       
        client.billReprintSimple(args, function(err, response) {
          if (err)
            throw err;
          console.log(response)
        });
      
      });*/
    }
module.exports = {
    async sendReprint (req, res, next) {
        
        const { cliId, InvoicesNum } = req.body;
        console.log({ cliId, InvoicesNum })
        const cliName = (await models.clients.findOne({ where: { cliId: cliId } })).cliName
        let InvoicesData = [];
        for (let index = 0; index < InvoicesNum.length; index++) {
            InvoicesData = (await models.invoices.findOne({ 
              where: { invNumber: InvoicesNum[index], cliId: cliId }, 
              include:[{
                    model: models.partners,
                    as: 'partners'
                }]
            }))
            switch (cliName.toUpperCase()) {
              case 'BEVAL':
                  reprint (BevalWsdl, InvoicesData.partners.prtKey, InvoicesData.invOrder);
                  break;
              case 'FEBECA':
                  reprint (FebecaWsdl, InvoicesData.partners.prtKey, InvoicesData.invOrder);
                  break;
              case 'SILLACA':
                  reprint (SillacaWsdl, InvoicesData.partners.prtKey, InvoicesData.invOrder);
                  break;
              }
              await models.invoices.findOne({
                where: {
                    invId: InvoicesData.invId
                }}).then(async (invoices) => {
                    if (invoices) {
                        await invoices.update({
                            invSended: 'true',
                          });
                      }
                  });
            }
            res.send('Ready')
        }
    }