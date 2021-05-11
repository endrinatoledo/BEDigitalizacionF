const Sequelize = require('sequelize');
const models = require('../models');
const Op = Sequelize.Op;
//npm requires
const fs = require('fs');
const isImage = require('is-image');
const Tesseract = require('tesseract.js');
const path = require('path');
const pdf2img = require('pdf-img-convert');
const imgToPDF = require('image-to-pdf');
const PDFDocument = require('pdf-lib').PDFDocument;
const emailValidator = require("email-validator");
//const poppler = require('pdf-poppler');
//const PDFParser = require('pdf2json');
const Jimp = require('jimp');
const cliProgress = require('cli-progress');
const axios = require('axios');
const { rectangle } = require('pdf-lib');
const { fail } = require('assert');
axios.defaults.baseURL = process.env.BASE_API + ":" +process.env.PORT + "/api/v1";
//project require


const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const { createWorker } = Tesseract;
//Functions
async function splitPdf(pathToPdf, name) {

    const docmentAsBytes = await fs.promises.readFile(pathToPdf);

    // Load your PDFDocument
    const pdfDoc = await PDFDocument.load(docmentAsBytes)

    const numberOfPages = pdfDoc.getPages().length;

    for (let i = 0; i < numberOfPages; i++) {
        // Create a new "sub" document
        const subDocument = await PDFDocument.create();
        // copy the page at current index
        const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
        subDocument.addPage(copiedPage);
        const pdfBytes = await subDocument.save()
        await writePdfBytesToFile(`./tmp/pdf/pages/${name}-${i}.pdf`, pdfBytes);

    }
}

async function writePdfBytesToFile(fileName, pdfBytes) {
    return fs.promises.writeFile(fileName, pdfBytes);
}
async function clearDir(){//Borra el contenido de './tmp/download'
    const directory = './tmp/download';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}
async function read(imgPath, num, orientation, client, dataPrefix, type, worker){//Funcion para leer el texto en una imagen
    const { rect1, rect2 } = await require('../../utils/constant/files').rectangleByClient(client);
    console.log("\nProceso iniciado para la pagina: "+ num);
    const fs = require('fs');
    try{
        if(isImage(imgPath)){
            const contents = await fs.readFileSync(imgPath, {encoding: 'base64'});
            const img = await rotate(contents, orientation, type);
            console.log("\n\tObteniendo #fact y #control");
            bar1.start(100, 0);
            let text = (await worker.recognize(img, {rectangle: rect1})).data.text;
            text += (await worker.recognize(img, {rectangle: rect2})).data.text;
            text = String(text);
            imgToPDF([imgPath], 'LETTER').pipe(fs.createWriteStream('./tmp/pdf/'+client+'/'+imgPath.split('./tmp/download/')[1]+'.pdf' ));
            if(strContainIgnoreAll(text, dataPrefix.Fprefix) && strContainIgnoreAll(text, dataPrefix.Cprefix)){
                const factNum =  dataPrefix.Fprefix + text.split('\n')[0].split(dataPrefix.Fprefix)[1].replace(/\D/g, "");
                const controlNum = dataPrefix.Cprefix + text.split(dataPrefix.Cprefix)[1].replace(/\D/g, "");
                bar1.stop();
                console.log("Proceso finalizado para la pagina: "+ num);
                fs.unlink(path.join('./tmp/download', imgPath.split('download/')[1]), err => {
                    if (err) throw err;
                });
                return {factNum, controlNum, err: false};
            }else{
                console.log("\nError en la pagina: "+ num);
                console.log({text})
                return {err: true, descript: 'el formato de factura encontrado es invalido'}
            }
        }else{
            console.log("\nError en la pagina: "+ num);
            return {err: true, descript: 'el archivo tiene un formato invalido'}
        }
        
    }catch(err){
        console.log("\nError en la pagina: "+ num);
        console.log({err})
        return {err: true, descript: 'el archivo no se pudo procesar'}
    }
}
async function rotate(img, orientation, type){//Funcion para rotar una imagen(base64)
    const buf = Buffer.from(img, 'base64');
    const image = await Jimp.read(buf);
    // rotate Function
    const result = await image.rotate(parseInt(orientation)).getBufferAsync(type);
    return result;
}
function strContainIgnoreAll(text, contain){//Busca una palabra en un str
    const result = String(text).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(contain.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1;
    return result;
}
async function readIMGS( file, count, res, orientation, client, dataPrefix ){//Funcion ciclica para hacer llamado a la lectura de imagenes
    let invoices = [], tmp;
    let factData, clientData;
    let emailReaded = '', countFail = 0, countCorrect = 0;
    let cli =  await models.clients.findOne({ where: {cliName: client} });
    emailReaded = await models.email_readed.create({
        erTotalFiles: count,
        erCorrectly: 0,
        erFailed : 0,
        erDate: new Date(), 
        cliId: cli.cliId
    })
    const worker = createWorker({
        logger: m => {
            //console.log(m)
            if(m.status == 'recognizing text'){
                bar1.update(parseInt(m.progress*10000)/100)
            }
        }
    });
    await worker.load();
    await worker.loadLanguage('spa');
    await worker.initialize('spa');
    for(let i = 0; i < count; i++){
        if(!file[i].saveError){
            tmp = await read(file[i].filename, i, orientation, client, dataPrefix, 'image/jpeg', worker);
            if(!tmp.err){
                console.log({tmp})
                factData = (await axios.get('/db2/getFactByNumBs/' + client + '?factNum=' + tmp.factNum.split("-")[1])).data;
                if(factData != undefined && factData != ''){
                    if(!factData.err && factData.results){
                        factData = factData.results;
                        clientData = (await axios.get('/db2/getClientEmail/' + client + '?clientKey=' + factData.clientKey )).data
                        if(clientData != undefined  && clientData != ''){
                            if(!clientData.err && clientData.results[0]){
                                clientData = clientData.results[0];
                                await fs.renameSync('./tmp/pdf/'+client+file[i].filename.split('./tmp/download')[1]+'.pdf', './tmp/pdf/'+client+'/'+tmp.factNum+'.pdf');
                                invoices.push({ pag: i, text: tmp, img: './tmp/pdf/'+client+'/'+tmp.factNum+'.pdf', factData, clientData });
                                await models.email_details.create({
                                    edFileName: file[i].originalName,
                                    edStatus: 'CORRECTO',
                                    edDescription:'Factura '+tmp.factNum+' escaneada correctamente',
                                    erId : emailReaded.erId,
                                    edDate: new Date()
                                })
                                countCorrect++;
                            }else{
                                console.log({clientData})
                                await models.email_details.create({
                                    edFileName: file[i].originalName,
                                    edStatus: 'ERROR',
                                    edDescription: 'Error al realizar la consulta a compiere (error de red), numero de factura: '+tmp.factNum,
                                    erId : emailReaded.erId,
                                    edDate: new Date()
                                })
                                countFail++;
                            }
                        }else{
                            await models.email_details.create({
                                edFileName: file[i].originalName,
                                edStatus: 'ERROR',
                                edDescription: 'Error al realizar la consulta a compiere, no se encontraron los datos del cliente numero de factura: '+tmp.factNum,
                                erId : emailReaded.erId,
                                edDate: new Date()
                            })
                            countFail++;
                        }
                    }else{
                        console.log({factData})
                        await models.email_details.create({
                            edFileName: file[i].originalName,
                            edStatus: 'ERROR',
                            edDescription: 'Error al realizar la consulta a compiere (error de red), numero de factura: '+tmp.factNum,
                            erId : emailReaded.erId,
                            edDate: new Date()
                        })
                        countFail++;
                    }
                }else{
                    if(client.toUpperCase() == 'SILLACA' || client.toUpperCase() == 'FEBECA'){
                        factData = (await axios.get('/db2/getFactByNumUsd/' + client + '?factNum=' + tmp.factNum.split("-")[1])).data;
                        if(factData != undefined  && factData != ''){
                            if(!factData.err && factData.results){
                                factData = factData.results;
                                clientData = (await axios.get('/db2/getClientEmail/' + client + '?clientKey=' + factData.clientKey )).data;
                                if(clientData != undefined  && clientData != ''){
                                    if(!clientData.err && clientData.results[0]){
                                        clientData = clientData.results[0]
                                        await fs.renameSync('./tmp/pdf/'+client+file[i].filename.split('./tmp/download')[1]+'.pdf', './tmp/pdf/'+client+'/'+tmp.factNum+'.pdf');
                                        invoices.push({ pag: i, text: tmp, img: './tmp/pdf/'+client+'/'+tmp.factNum+'.pdf', factData, clientData });
                                        await models.email_details.create({
                                            edFileName: file[i].originalName,
                                            edStatus: 'CORRECTO',
                                            edDescription:'Factura '+tmp.factNum+' escaneada correctamente',
                                            erId : emailReaded.erId,
                                            edDate: new Date()
                                        })
                                        countCorrect++;
                                    }else{
                                        console.log({clientData})
                                        await models.email_details.create({
                                            edFileName: file[i].originalName,
                                            edStatus: 'ERROR',
                                            edDescription: 'Error al realizar la consulta a compiere (error de red), numero de factura: '+tmp.factNum,
                                            erId : emailReaded.erId,
                                            edDate: new Date()
                                        })
                                        countFail++;
                                    }
                                }else{
                                    await models.email_details.create({
                                        edFileName: file[i].originalName,
                                        edStatus: 'ERROR',
                                        edDescription: 'Error al realizar la consulta a compiere, no se encontraron los datos del cliente numero de factura: '+tmp.factNum,
                                        erId : emailReaded.erId,
                                        edDate: new Date()
                                    })
                                    countFail++;
                                }
                            }else{
                                console.log({factData})
                                await models.email_details.create({
                                    edFileName: file[i].originalName,
                                    edStatus: 'ERROR',
                                    edDescription: 'Error al realizar la consulta a compiere (error de red), numero de factura: '+tmp.factNum,
                                    erId : emailReaded.erId,
                                    edDate: new Date()
                                })
                                countFail++;
                            }
                        }else{
                            await models.email_details.create({
                                edFileName: file[i].originalName,
                                edStatus: 'ERROR',
                                edDescription: 'Error al realizar la consulta a compiere, numero de factura: '+tmp.factNum,
                                erId : emailReaded.erId,
                                edDate: new Date()
                            })
                            countFail++;
                        }
                    }else{
                        await models.email_details.create({
                            edFileName: file[i].originalName,
                            edStatus: 'ERROR',
                            edDescription: 'Error al realizar la consulta a compiere, numero de factura: '+tmp.factNum,
                            erId : emailReaded.erId,
                            edDate: new Date()
                        })
                        countFail++;
                    }
                    
                }
                
            }else{
                await models.email_details.create({
                    edFileName: file[i].originalName,
                    edStatus: 'ERROR',
                    edDescription: 'Error al escanear el archivo, '+tmp.descript,
                    erId : emailReaded.erId,
                    edDate: new Date()
                })
                countFail++;
            }
        
        }else{
            await models.email_details.create({
                edFileName: file[i].originalName,
                edStatus: 'ERROR',
                edDescription: 'Error en descarga',
                erId : emailReaded.erId,
                edDate: new Date()
            })
            countFail++;
        }
    }
    await worker.terminate();
    await emailReaded.update({
        erCorrectly: countCorrect,
        erFailed : countFail
    });
    //await clearDir(); //Habilitar para borrar las imagenes(paginas del pdf) luego de analizarlas
    console.log("Listo para todas las paginas");
    try{
        let prt, duplicated = false, order, clientData2;
        await models.batchs_mirror.create({
            bthSended: "false",
            cliId: cli.cliId,
            initInv : 0,
            lastInv: 0
        }).then(async function(batchs_mirror) {
            for(let index2 = 0; index2 < invoices.length; index2++ ){
                order = invoices[index2].factData
                clientData2 = invoices[index2].clientData;
                await models.partners.findOne({ where: {prtKey: order.clientKey } })
                    .then(async function(obj) {
                    // update
                    if(obj){
                        await obj.update({
                            prtName: clientData2.NAME,
                            prtEmail: emailValidator.validate(clientData2.EXT_EMAIL) ? clientData2.EXT_EMAIL : 'null',
                            prtKey: order.clientKey
                        });
                    }else{
                        
                        // insert
                        await models.partners.create({
                            prtName: clientData2.NAME,
                            prtEmail: emailValidator.validate(clientData2.EXT_EMAIL) ? clientData2.EXT_EMAIL : 'null',
                            prtKey: order.clientKey
                        });
                    }
                    prt = await models.partners.findOne({ where: {prtKey: order.clientKey } });
                    if(invoices[index2].readError == undefined){
                        if(await models.invoices_mirror.findOne({ where: { invNumber: invoices[index2].text.factNum, cliId: cli.cliId } })){
                            duplicated = true;
                        }else{
                            await models.invoices_mirror.create({
                                invNumber: invoices[index2].text.factNum,
                                invControlNumber: invoices[index2].text.controlNum,
                                invZone: invoices[index2].factData.VENDVP,
                                invSeller: invoices[index2].factData.VENDVP,
                                invTrip: invoices[index2].factData.NUMRVP ,
                                invOrder: invoices[index2].factData.NPEDVP,
                                cliId: cli.cliId,
                                prtId: prt.prtId,
                                bthId: batchs_mirror.bthId,
                                fileRoute: './tmp/pdf/'+client+'/'+invoices[index2].text.factNum+'.pdf',
                                invReleaseDate: invoices[index2].factData.FECPVP,
                                readError: "false"
                                })
                            }
                        }else{
                            if(await models.invoices_mirror.findOne({ where: { invNumber: invoices[index2].factNum, cliId: cli.cliId } })){
                                duplicated = true;
                            }else{
                        
                                await models.invoices_mirror.create({
                                    invNumber: invoices[index2].factNum,
                                    cliId: cli.cliId,
                                    prtId: prt.prtId,
                                    invOrder: order.NPEDVP,
                                    bthId: batchs_mirror.bthId,
                                    readError: "true"
                                    })
                                }
                            }
                        return 'yes'
                    })   
            
            }
            if(duplicated){
                console.log('Error, algunas facturas estan registradas previamente')
                res.json({message: 'Error, facturas previamente registradas'});
            }else{
                res.json({ file, invoices, bthId: batchs_mirror.bthId})
            }
        });
        
    }catch(err){
        console.dir(err);
        message = 'Error interno del servidor';
        res.status(500).json(message);
    }
}

//Exports
async function readImages(req, res, next){
    //pdfArray = await pdf2img.convert(req.file.filename);
    //for (i = 0; i < pdfArray.length; i++){
    //  fs.writeFile("./tmp/download/"+path.basename(req.file.filename, path.extname(req.file.filename))+ "-" + i+".png", pdfArray[i], function (error) {
    //    if (error) { console.error("Error: " + error); }
    //  });
    //}
    //await await splitPdf(req.file.filename, path.basename(req.file.filename, path.extname(req.file.filename)) );
    let count = 1, max = 10;
    while (count != max) {
        try {
            console.log({count})
            readIMGS( req.body.files, req.body.files.length, res, req.body.orientation, req.body.client, { Cprefix: req.body.Cprefix, Fprefix: req.body.Fprefix});
            count = max;
        } catch (error) {
            console.log(error);
            count++;
            console.log('fallo la lectura de imagenes, fallo #'+count)
            
        }   
    }
}

module.exports = { readImages };
