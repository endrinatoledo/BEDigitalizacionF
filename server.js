//NPM requires
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
axios.defaults.baseURL = process.env.BASE_API + ":" +process.env.PORT + "/api/v1";
//Project's require
const version = '/api/v1';
const clientsRouter = require('./src/routes/clientsRouter');
const usersRouter = require('./src/routes/usersRouter.js');
const invoicesRouter = require('./src/routes/invoicesRouter');
const invoicesSorterRouter = require('./src/routes/invoicesSorterRouter');
const db2Invoices = require('./src/routes/db2InvoicesRouter');
const sendEmail = require('./src/routes/sendEmailRouter'); 
const batch = require('./src/routes/batchRouter'); 
const partners = require('./src/routes/partnersRouter'); 
const syncClientDataRouter = require('./src/routes/syncClientDataRouter'); 
const reprintRouter = require('./src/routes/reprintRouter')
const configRouter = require('./src/routes/configRouter')
const readEmailRouter = require('./src/routes/readEmailRouter')
const readImageRouter = require('./src/routes/readImageRouter');
const emailInfoRouter = require('./src/routes/emailInfoRouter');
//Initialization
const dirs = [
    __dirname + '/tmp/pdf/',
    __dirname + '/tmp/download/',
    __dirname + '/tmp/pdf/beval',
    __dirname + '/tmp/pdf/febeca',
    __dirname + '/tmp/pdf/sillaca',

]
for (let index = 0; index < dirs.length; index++) {
    fs.mkdirSync(dirs[index], { recursive: true });
    
}

const app = express();
const storage =
    multer.diskStorage({
    destination: path.join(__dirname, 'tmp/img/'), // destination folder
    filename: (req, file, cb) => {
        cb(null,file.originalname.split(".")[0]+ '-' + Date.now()+path.extname(file.originalname)); //Appending extension
    }
});

const upload = multer({ 
    storage, 
    dest: path.join(__dirname, 'tmp/img/'), // destination folder
    limits: {fileSize: 3500000}, // size we will acept, not bigger
    fileFilter: (req, file, cb) => {
        return cb(null, true);
    }   
    }).array('pdf');
app.use(upload);
const PORT = process.env.PORT || 2001;


app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


//Rutas
app.use(version, clientsRouter);
app.use(version, usersRouter);
app.use(version, invoicesRouter);
app.use(version, invoicesSorterRouter);
app.use(version, db2Invoices);
app.use(version+'/public', express.static('tmp/pdf'))
app.use(version, sendEmail)
app.use(version, batch)
app.use(version, partners)
app.use(version, syncClientDataRouter)
app.use(version, reprintRouter)
app.use(version, configRouter)
app.use(version,readEmailRouter)
app.use(version, readImageRouter)
app.use(version, emailInfoRouter)
//Server
app.set('port', PORT);
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Backend solicitud S-TA-24 corriendo en localhost:${PORT}`));


const interval_long =  1*10*1000;//10 seg
async function timer_Reg(interval_long){
    console.log(new Date())
    try {
        await axios.get('/readEmails');
        await axios.get('/checkEmails');
    } catch (error) {
        console.error(error)
    }
    console.log(new Date())
    setTimeout(function(){ timer_Reg(interval_long); }, interval_long);//Renew timer_Reg
}
timer_Reg(interval_long)
