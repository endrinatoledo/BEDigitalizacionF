const JDBC = require('jdbc');
const jinst = require('jdbc/lib/jinst');
const asyncjs = require('async');
if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    jinst.setupClasspath(['./drivers/jt400.jar']);
}


const getConnection = async (query, config, schema) => {
    let response;
    var ibmi = new JDBC(config);

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
                                    statement.executeQuery(query,
                                        function (err, resultset) {
                                            if (err) {
                                                res.json({ err })
                                                callback(err)
                                            } else {
                                                console.log('SUCCESS: select')
                                                resultset.toObjArray(async function (err, results) {
                                                    if (results.length > 0) {
                                                        console.log("Result: " + JSON.stringify(results[0]));
                                                        return results
                                                    }
                                                    else{
                                                        return results;
                                                    }
                                                    callback(null, resultset);
                                                });
                                            }
                                        });
                                }
                            });
                        }
                    });
                },

            ], function (err, results) {
                console.log('results2:' + results);
                ibmi.release(connObj, function (err) {
                    if (err) {
                        console.log(err.message);
                    }
                });
            });
        }

    });

}

module.exports = getConnection;