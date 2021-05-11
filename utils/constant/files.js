//Exports
async function rectangleByClient(client){
    switch(client.toLowerCase()){
        case "sillaca":
            return {
                rect1: {
                    top: 0,
                    left: 1800,
                    width: 600,
                    height: 200
                },
                rect2: {
                    top: 1500,
                    left: 0,
                    width: 350,
                    height: 200
                }
            };
        default:
            return {
                rect1: {
                    top: 0,
                    left: 1800,
                    width: 600,
                    height: 200
                },
                rect2: {
                    top: 1500,
                    left: 0,
                    width: 350,
                    height: 200
                }
            };
    }
}

module.exports = { rectangleByClient };