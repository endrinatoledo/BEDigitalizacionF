const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//Routes functions
const { sillaca } = require('../../db2/sillaca');
const { beval } = require('../../db2/beval');
const { febeca } = require('../../db2/febeca');

async function getFactByNumBs (req, res, next) {
    //Example http://localhost:2001/api/v1/db2/getFactByNum/sillaca?factNum=01948475
    /*
    Examples:

        -
        -   http://localhost:2001/api/v1/db2/getFactByNum/febeca?factNum=05961772
        -   http://localhost:2001/api/v1/db2/getFactByNum/sillaca?factNum=01948475

    */
    const { client } = req.params;
    switch (client.toUpperCase()) {
        case "SILLACA":
            await sillaca.getFactByNumBs( res, req.query.factNum );
            break;
        case "BEVAL":
            await beval.getFactByNum( res, req.query.factNum );
            break;
        case "FEBECA":
            await febeca.getFactByNumBs( res, req.query.factNum );
            break;
        default:
            res.json({err: "INVALID REQUEST"});
            break;
    }
}
async function getFactByNumUsd (req, res, next) {
    //Example http://localhost:2001/api/v1/db2/getFactByNum/sillaca?factNum=01948475
    /*
    Examples:

        -
        -   http://localhost:2001/api/v1/db2/getFactByNum/febeca?factNum=05961772
        -   http://localhost:2001/api/v1/db2/getFactByNum/sillaca?factNum=01948475

    */
    const { client } = req.params;
    switch (client.toUpperCase()) {
        case "SILLACA":
            await sillaca.getFactByNumUsd( res, req.query.factNum );
            break;
        case "FEBECA":
            await febeca.getFactByNumUsd( res, req.query.factNum );
            break;
        default:
            res.json({err: "INVALID REQUEST"});
            break;
    }
}
async function getClientEmail (req, res, next) {
    /*
   Examples:

       -
       -   http://localhost:2001/api/v1/db2/getClientEmail/febeca?clientKey=8143380
       -   http://localhost:2001/api/v1/db2/getClientEmail/sillaca?clientKey=2290625

   */
    const { client } = req.params;
    switch (client) {
        case "sillaca":
            await sillaca.getEmail( res, req.query.clientKey );
            break;
        case "beval":
            await beval.getEmail( res, req.query.clientKey );
            break;
        case "febeca":
            await febeca.getEmail( res, req.query.clientKey );
            break;
        default:
            res.json({err: "INVALID REQUEST"})
            break;
    }
}

async function getSellerEmail (req, res, next) {
    /*
   Examples:

       -
       -   http://localhost:2001/api/v1/db2/getSellerEmail/febeca?factNum=A-05961772

   */
    const { client } = req.params;
    switch (client) {
        case "sillaca":
            await sillaca.getSellerEmail( res, req.query.factNum );
            break;
        case "beval":
            await beval.getSellerEmail( res, req.query.factNum );
            break;
        case "febeca":
            await febeca.getSellerEmail( res, req.query.factNum );
            break;
        default:
            res.json({err: "INVALID REQUEST"})
            break;
    }
}

module.exports = { getFactByNumBs, getFactByNumUsd, getClientEmail, getSellerEmail };