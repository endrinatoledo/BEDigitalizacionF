const nodemailer = require('nodemailer');
const models = require('../models');
const fs = require('fs')
const EmailValidator = require("email-validator");
const creator = require('axios');
const axiosCustom = creator.create({
	baseURL: process.env.BASE_API + ":" +process.env.PORT + "/api/v1"
  });
let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS
    }
})
module.exports = {
	async sendByBatch(req, res, next) {
		const { bthId } = req.body
		const invoices = await models.invoices.findAll({
            where:{
				bthId: bthId,
				readError: 'false'
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
                ['invNumber', 'ASC'],

            ],
		})
		let sellerEmail
		for(let i = 0; i < invoices.length; i++){
			sellerEmail = (await axiosCustom.get('/db2/getSellerEmail/'+invoices[i].clients.cliName+'?factNum='+invoices[i].invNumber)).data
			sellerEmail = sellerEmail.results
			sellerEmail = sellerEmail.length == 0 ? '' : sellerEmail[0].VENDEDOR
			console.log({sellerEmail, clientEmail: invoices[i].partners.prtEmail})
			if(EmailValidator.validate(sellerEmail)){
				await axiosCustom.post('/sendEmail', {
					email: sellerEmail,
					subject: "Factura N°: " +invoices[i].invNumber,
					text: "Factura N°: " +invoices[i].invNumber,
					filename: "Factura N°: " +invoices[i].invNumber+".pdf",
					content: invoices[i].fileRoute
                  })
                await models.invoices.update({invSended: 'true'},{where:{invId: invoices[i].invId}})
			    await  models.batchs.update({bthSended: 'true'},{where:{bthId: bthId}})
			}
			if(EmailValidator.validate(invoices[i].partners.prtEmail)){
			  await axiosCustom.post('/sendEmail', {
				email: invoices[i].partners.prtEmail,
				subject: "Factura N°: " +invoices[i].invNumber,
				text: "Factura N°: " +invoices[i].invNumber,
				filename: "Factura N°: " +invoices[i].invNumber+".pdf",
				content: invoices[i].fileRoute
			  })
			}
		}
		res.send('SENDED')
	},
    async sendEmail (req, res, next) {
        const {email, subject, text, filename, content} = req.body
        console.log("SEND EMAIL")
        console.log({email, subject, text, filename, content})
  	    const message = {
	        from: process.env.EMAIL, // Sender address
	        to: email,         // List of recipients
	        subject: subject, // Subject line
			text: text, // Plain text body
			attachments: [
				{
				  filename: filename,
				  content: fs.createReadStream(content)
				}
			  ]
	    };
	    transport.sendMail(message, function(err, info) {
	        if (err) {
				console.log(err)
				res.send(err)
	        } else {
				console.log(info)
				res.send(info)
	        }
	    })
	},
	async multiFileEmail (req, res, next) {
		const {email, subject, text, filename, content} = req.body
  	    const message = {
	        from: process.env.EMAIL, // Sender address
	        to: email,         // List of recipients
	        subject: subject, // Subject line
			text: text, // Plain text body
			attachments: filename.map( (el, i) => { 
				return { 
					filename: el,
					content: fs.createReadStream(content[i])
					}
				})
	    };
	    transport.sendMail(message, function(err, info) {
	        if (err) {
				console.log(err)
				res.send(err)
	        } else {
				console.log(info)
				res.send(info)
	        }
	    })
    }

};
