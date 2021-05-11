const JDBC = require('jdbc');
const jinst = require('jdbc/lib/jinst');
const asyncjs = require('async');
if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    jinst.setupClasspath(['./drivers/jt400.jar']);
}
//Beval
const server = process.env.BevalHost;
const schema = process.env.BevalSchema;
const user = process.env.BevalUser;
const password = process.env.BevalPassword;

const config = {
    url: 'jdbc:as400://' + server + '/' + schema,
    drivername: 'com.ibm.as400.access.AS400JDBCDriver',
    minpoolsize: 10,
    maxpoolsize: 100,
    properties: {
        user: user,
        password: password
    }
};

function objExtractor(OBJ) {//Funcion para hacer parse a tipo string a todas las propiedades de un Objeto
    let resp = [];
    for (let i = 0; i < OBJ.length; i++) {
        resp.push({});
        for (let [key, value] of Object.entries(OBJ[i])) {
            resp[i][key]= String(value)
        }
    }
    return resp;
}
function keyGen(OBJ) {//Funcion para hacer parse a tipo string a todas las propiedades de un Objeto
    let str = "";
    str = (OBJ[0].CLI1VP.length !=2 ? "0"+OBJ[0].CLI1VP : OBJ[0].CLI1VP)
    str = (OBJ[0].CLI2VP.length !=2 ? str+"0"+OBJ[0].CLI2VP : str+OBJ[0].CLI2VP)
    str = (OBJ[0].CLI3VP.length !=3 ? (OBJ[0].CLI3VP.length ==2 ? str+"0"+OBJ[0].CLI3VP : str+"00"+OBJ[0].CLI3VP) : str+OBJ[0].CLI3VP)
    OBJ[0].clientKey = str;
    return OBJ[0];
}
const ibmi = new JDBC(config);

function getFactByNum( res, factNum ){//Funcion para obtener los datos de la factura, segun su numero
    try {
        ibmi.initialize(function (err) {
            if (err) {
                console.log(err);
            }
        });
    
        ibmi.reserve(function (err, connObj) {
            // The connection returned from the pool is an object with two fields
            // {uuid: <uuid>, conn: <Connection>}
            if (connObj) {
                console.log("Using connection: " + connObj.uuid);
                // Grab the Connection for use.
                var conn = connObj.conn;
                // Adjust some connection options. See connection.js for a full set of
                // supported methods.
                asyncjs.series([
                    function (callback) {
                        conn.setAutoCommit(false, function (err) {
                            if (err) {
                                console.log(err)
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    },
    
                    function (callback) {
                        conn.setSchema(schema, function (err) {
                            if (err) {
                                console.log(err)
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    }
                ], function (err, results) {
                    // Process result
                });
    
                // Query the database.
                asyncjs.series([
                    function (callback) {
                        // Select statement example.
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                console.log(err)
                                callback(err);
                            } else {
                                // Adjust some statement options before use. See statement.js for
                                // a full listing of supported options.
                                statement.setFetchSize(100, function (err) {
                                    if (err) {
                                        console.log(err)
                                        callback(err);
                                    } else {
                                        statement.executeQuery(`SELECT * FROM MAYORBVL.VENTASP WHERE FACTVP LIKE '%${factNum}%'`,
                                            function (err, resultset) {
                                                if (err) {
                                                    console.log(err)
                                                    res.json({err});
                                                } else {
                                                    resultset.toObjArray(function (err, results) {
                                                        if (err) {
                                                            res.json({err});
                                                        }
                                                        else {
                                                            if(results.length > 0){
                                                                res.json({ results: keyGen(objExtractor(results)) });
                                                            }else{
                                                                res.json(undefined) 
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                    }
                                });
                            }
                        });
                    },
    
                ]);
            }else{
                console.log({err})
                res.json({err});
            }
    
        });
        
    } catch (error) {
        console.log({error})
        res.json({err: error}); 
    }

}
function getEmail(res, clientKey){//Funcion para obtener los datos de la factura, segun su numero
    try {
        ibmi.initialize(function (err) {
            if (err) {
                console.log(err);
            }
        });
    
        ibmi.reserve(function (err, connObj) {
            // The connection returned from the pool is an object with two fields
            // {uuid: <uuid>, conn: <Connection>}
            if (connObj) {
                console.log("Using connection: " + connObj.uuid);
                // Grab the Connection for use.
                var conn = connObj.conn;
                // Adjust some connection options. See connection.js for a full set of
                // supported methods.
                asyncjs.series([
                    function (callback) {
                        conn.setAutoCommit(false, function (err) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    },
    
                    function (callback) {
                        conn.setSchema(schema, function (err) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    }
                ], function (err, results) {
                    // Process result
                });
    
                // Query the database.
                asyncjs.series([
                    function (callback) {
                        // Select statement example.
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                callback(err);
                            } else {
                                // Adjust some statement options before use. See statement.js for
                                // a full listing of supported options.
                                statement.setFetchSize(100, function (err) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        statement.executeQuery(`SELECT NAME, EXT_EMAIL FROM ${process.env.BevalSchema}.C_BPARTNER WHERE VALUE LIKE '${clientKey}'`,
                                            function (err, resultset) {
                                                if (err) {
                                                    console.log(err)
                                                    res.json({err});
                                                } else {
                                                    resultset.toObjArray(function (err, results) {
                                                        if (err) {
                                                            res.json({err});
                                                        }
                                                        else {
                                                            if(results.length > 0){
                                                                res.json({ results: objExtractor(results) });
                                                            }else{
                                                                res.json(undefined) 
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                    }
                                });
                            }
                        });
                    },
    
                ]);
            }else{
                console.log({err})
                res.json({err});
            }
    
        });
        
    } catch (error) {
        console.log({error})
        res.json({err: error});    
    }

}
function getSellerEmail(res, factNum){//Funcion para obtener los datos de la factura, segun su numero
    try {
        ibmi.initialize(function (err) {
            if (err) {
                console.log(err);
            }
        });
    
        ibmi.reserve(function (err, connObj) {
            // The connection returned from the pool is an object with two fields
            // {uuid: <uuid>, conn: <Connection>}
            if (connObj) {
                console.log("Using connection: " + connObj.uuid);
                // Grab the Connection for use.
                var conn = connObj.conn;
                // Adjust some connection options. See connection.js for a full set of
                // supported methods.
                asyncjs.series([
                    function (callback) {
                        conn.setAutoCommit(false, function (err) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    },
    
                    function (callback) {
                        conn.setSchema(schema, function (err) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    }
                ], function (err, results) {
                    // Process result
                });
    
                // Query the database.
                asyncjs.series([
                    function (callback) {
                        // Select statement example.
                        conn.createStatement(function (err, statement) {
                            if (err) {
                                callback(err);
                            } else {
                                // Adjust some statement options before use. See statement.js for
                                // a full listing of supported options.
                                statement.setFetchSize(100, function (err) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        statement.executeQuery("SELECT  VP.FACTVP AS FACTURA, BP.NAME AS CLIENTE, VP.VENDVP AS ZONA, U.NAME, U.EMAIL AS VENDEDOR FROM MAYORBVL.VENTASP VP JOIN "+process.env.BevalSchema+".C_BPARTNER BP ON DIGITS(VP.CLI1VP)||DIGITS(VP.CLI2VP)||DIGITS(VP.CLI3VP)=BP.VALUE LEFT JOIN "+process.env.BevalSchema+".C_SALESREGION SR ON CAST(VP.VENDVP AS VARCHAR(40))=SR.VALUE LEFT JOIN "+process.env.BevalSchema+".AD_USER U ON SR.SALESREP_ID=U.AD_USER_ID WHERE VP.FACTVP=SUBSTRING('"+factNum+"', 3, 27) ",
                                            function (err, resultset) {
                                                if (err) {
                                                    console.log(err)
                                                    res.json({err});
                                                } else {
                                                    resultset.toObjArray(function (err, results) {
                                                        if (err) {
                                                            res.json({err});
                                                        }
                                                        else {
                                                            if(results.length > 0){
                                                                res.json({ results: objExtractor(results) });
                                                            }else{
                                                                res.json(undefined) 
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                    }
                                });
                            }
                        });
                    },
    
                ]);
            }else{
                console.log({err})
                res.json({err});
            }
    
        });
        
    } catch (error) {
        console.log({error})
        res.json({err: error}); 
       
    }
}
module.exports = { beval: { getFactByNum, getEmail, getSellerEmail } };