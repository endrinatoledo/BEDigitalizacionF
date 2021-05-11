//npm requires
require('dotenv').config()
const fs = require('fs');
const Tesseract = require('tesseract.js');
const path = require('path');
const poppler = require('pdf-poppler');
const PDFParser = require('pdf2json');
const Jimp = require('jimp');
const cliProgress = require('cli-progress');
const axios = require('axios')
axios.defaults.baseURL = process.env.BASE_API + ":" +process.env.PORT
//project require
const pool = require('../db/conn');
//init
pool.sequelize.sync();
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const { createWorker } = Tesseract;
const worker = createWorker({
  logger: m => {
      if(m.status == 'recognizing text'){
        bar1.update(parseInt(m.progress*10000)/100)
      }
  }
});
//Functions
async function clearDir(){//Borra el contenido de './tmp/img'
  const directory = './tmp/img';
  fs.readdir(directory, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});
}
async function read(imgPath, num, orientation, client){//Funcion para leer el texto en una imagen
  const { rect1, rect2 } = await require('./constant/files').rectangleByClient(client);
    console.log("\nProceso iniciado para la pagina: "+ num)
    await worker.load();
    await worker.loadLanguage('spa');
    await worker.initialize('spa');
    const fs = require('fs');
    const contents = await fs.readFileSync(imgPath, {encoding: 'base64'});
    /*
    let  { data }  = await worker.detect(imgPath);//Auto detect orientation (err is too few characters: crash)
    const img = await rotate(contents, -1*data.orientation_degrees)
    */
    const img = await rotate(contents, orientation)
    console.log("\n\tObteniendo #fact")
    bar1.start(100, 0);
    const factNum = (await worker.recognize(img, {
      rectangle: rect1,//Limited area
    })).data.text.split('": ')[1].split('\n')[0].split(/\s/).join('');
    bar1.stop();
    console.log("\n\tObteniendo #control")
    bar1.start(100, 0);
    const controlNum = ("0"+(await worker.recognize(img, {
      rectangle: rect2,//Limited area
    })).data.text.split('\n0')[1]).split('\n')[0].split(/\s/).join('');
    bar1.stop();
    console.log("Proceso finalizado para la pagina: "+ num)
    return {factNum, controlNum};
}
async function rotate(img, orientation){//Funcion para rotar una imagen(base64)
  const buf = Buffer.from(img, 'base64');
  const image = await Jimp.read(buf);
 // rotate Function
  const result = await image.rotate(parseInt(orientation)).getBufferAsync('image/png');
  return result;
}
function strContainIgnoreAll(text, contain){//Busca una palabra en un str
  const result = text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(contain.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1
  return result;
}
async function readIMGS( file, count, prefix, res, orientation, client ){//Funcion ciclica para hacer llamado a la lectura de imagenes
    let invoices = [], tmp;
    for(let i = 1; i <= count; i++){
        tmp = await read("./tmp/img/"+prefix+i+".jpg", i, orientation, client);
        invoices.push({ pag: i, text: tmp, img: "./tmp/img/"+prefix+i+".jpg" });
    }
    await worker.terminate();
    //await clearDir(); //Habilitar para borrar las imagenes(paginas del pdf) luego de analizarlas
    console.log("Listo para todas las paginas")
    let factData, clientData;
    for( let j = 0; j < invoices.length; j++ ){
      factData = (await axios.get('/invoices/getFactByNum/' + client + '?factNum=' + invoices[j].text.factNum.split("-")[1])).data.results
      clientData = (await axios.get('/invoices/getClientEmail/' + client + '?clientKey=' + factData.clientKey )).data.results
      invoices[j] = {...invoices[j], factData, clientData }
    }
    res.json({ file, invoices})
}

//Exports
async function readPDF(file, res, orientation, client){
    let opts = {
        format: 'jpeg',
        out_dir: "./tmp/img",
        out_prefix: path.basename(file, path.extname(file)),
        page: null
    }
    await poppler.convert(file, opts)
    let pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataReady', function(data) {
        readIMGS( file, data.formImage.Pages.length, path.basename( file, path.extname(file) ) + "-", res, orientation, client)
    });
    pdfParser.loadPDF(file)
}

module.exports = { readPDF }; 