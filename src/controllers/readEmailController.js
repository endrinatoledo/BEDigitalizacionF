const sequelize = require('sequelize');
const models = require('../models');
var imaps = require('imap-simple');
const fs = require('fs');
const stream = require('stream');
const axios = require('axios');
axios.defaults.baseURL = process.env.BASE_API + ":" +process.env.PORT + "/api/v1";

var config = {
    imap: {
        user: process.env.APP_EMAIL_USER,
        password: process.env.APP_EMAIL_PASS,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 3000,
        markSeen : true,
        markRead : true,
        //debug: console.log
    }
};
function saveAttachment(name, body, cb) {    
    // Initiate the source
    var bufferStream = new stream.PassThrough();
    var writeStream = fs.createWriteStream('./tmp/download/'+name);

    // Write your buffer
    bufferStream.end(Buffer.from(body, 'base64'));

    // Pipe it to something else  (i.e. stdout)
    bufferStream.pipe(writeStream);

    cb(undefined);
}
function randString(){
    var s = "";
    while(s.length < 50){
        var r = Math.random();
        s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
    }
    return s;
}
function load(EMAIL, res){
    let saveError;
    imaps.connect(config).then(function (connection) {
        connection.openBox('INBOX').then(function () {
            var searchCriteria = ["UNSEEN",['FROM', EMAIL]]
            var fetchOptions = { bodies: ['HEADER.FIELDS (TO FROM SUBJECT)'], struct: true };
     
            // retrieve only the headers of the messages
            return connection.search(searchCriteria, fetchOptions);
        }).then(function (messages) {
            
            
            var attachments = [];
            messages.forEach(function (message) {
                var parts = imaps.getParts(message.attributes.struct);
                attachments = attachments.concat(parts.filter(function (part) {
                    return part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT';
                }).map(function (part) {
                    // retrieve the attachments only of the messages with attachments
                    return connection.getPartData(message, part)
                        .then(function (partData) {
                            let rand = randString();
                            
                            saveAttachment(rand+part.disposition.params.filename, partData, function(err) {
                                if(err) {
                                    console.log(err);
                                    saveError = true
                                }else{
                                    saveError = false
                                }
                            });
                            return {
                                filename: './tmp/download/'+rand+part.disposition.params.filename,
                                originalName: part.disposition.params.filename,
                                saveError
                                //data: partData
                            };
                        });
                }));
                connection.addFlags(message.attributes.uid, '\Seen', (err) => {
                    if (err){
                        console.log(err);
                    }else{
                        console.log('Marked as read')
                    }
                })
            });
     
            return Promise.all(attachments);
        }).then(function (attachments) {
            console.log({EMAIL, files: attachments});
            connection.imap.closeBox(true, (err) => {
                if (err){
                    console.log(err);
                }
            });
            connection.end();
            res.json(attachments);
        });
    }).catch(err => {
        console.log(err)
        res.send('ERROR')
    });
}

async function repeat (res, prevReq, prevData, prevIndex){
    console.log({prevReq, prevData: (prevData == undefined ? undefined : prevData.cfgPrinterEmail), prevIndex})
    let request = undefined, cData = undefined, cIndex2 = undefined;
    intent: try {
        const data = (await models.configs.findAll({
            include:[
                {
                    model: models.clients,
                    as: 'clients'
                }],
        }));
        if(prevReq == 'ERROR'){
            request = (await axios.post('/readEmail', { email: prevData.cfgPrinterEmail})).data;
            cData = prevData;
            if(request != 'ERROR'){
                if(request.length != 0){
                    cIndex2 = index2;
                        await axios.post('/readImages', {
                            client: prevData.clients.cliName,
                            orientation: 0,
                            Cprefix: prevData.cfgCtrlPrefix,
                            Fprefix: prevData.cfgInvPrefix,
                            files: request
                        })
                }
            }else{
                repeat(res, request, cData, cIndex2)
                break intent;
            }
        }else if(prevReq != undefined){
            request = prevReq;
            cData = prevData;
            if(prevReq.length != 0){
                await axios.post('/readImages', {
                    client: prevData.clients.cliName,
                    orientation: 0,
                    Cprefix: prevData.cfgCtrlPrefix,
                    Fprefix: prevData.cfgInvPrefix,
                    files: prevReq
                })
                
            }
        }
        let index = 0
        for (index = 0; index < data.length; index++) {
            request = (await axios.post('/readEmail', { email: data[index].cfgPrinterEmail})).data;
            cData = data[index];
            if(prevReq != 'ERROR'){
                if(request.length != 0){
                    cIndex2 = index2;
                        await axios.post('/readImages', {
                            client: data[index].clients.cliName,
                            orientation: 0,
                            Cprefix: data[index].cfgCtrlPrefix,
                            Fprefix: data[index].cfgInvPrefix,
                            files: request
                        })
                }
            }else{
                repeat(res, request, cData, cIndex2)
                break intent;
            }
        }
        res.send('ready')   
    } catch (error) {
        repeat(res, request, cData, cIndex2)
    }
}
module.exports = {
    async getEmail (req, res, next) {
        const { email } = req.body
        load( email, res)
        },
    async checkFails(req, res, next) {
        const data = (await models.email_readed.findAll({
            where: sequelize.where(
                sequelize.literal('er_correctly+er_failed-er_total_files'),
                '<',
                0)
        }));
        if(data.length != 0){
            let element
            for (let index = 0; index < data.length; index++) {
                element = await models.email_readed.findOne({ where: {erId: data[index].erId } })
                console.log({element})
                await element.update({
                    erCorrectly: 0,
                    erFailed : data[index].erTotalFiles
                });
                await models.email_details.update({
                    edDescription: 'No se pudo inicializar el OCR',
                    edStatus: 'ERROR'
                },
                { 
                    where: {erId: data[index].erId } 
                });
            }
        }
        res.json(data)
        },
    async getEmails (req, res, next) {
        repeat(res, undefined, undefined, undefined)
        },
        
    }