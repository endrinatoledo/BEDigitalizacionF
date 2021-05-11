//.env
//require('dotenv').config()
//project require
const pool = require('../db/conn');
//init
pool.sequelize.sync();

//functions
async function getAll(req, res){
    const result = await pool.Users.findAll()
    res.send(result)
};

async function getOne(req, res){
    const { id } = req.params;
    const result = await pool.Users.findOne({
        where: {
            usr_id: id,
        }
    });
    res.send(result == null ? [] : result)
}
module.exports = { getAll, getOne }; 