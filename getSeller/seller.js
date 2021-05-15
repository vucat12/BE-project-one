const express = require('express');
const port = 3002;
const app = express();
var cors = require('cors');
app.use(cors());


var seller = {
    getSeller: function(err, data){
        if (err) throw err;
        else {
            this.getRateHouse(data);
            const server = app.listen(port, (error) => {
                if (error) return console.log(`Error: ${error}`);
                console.log(`Server listening on port ${server.address().port}`);

            });
    }
    },
    getLowHouse: function(arrData) {
        millionHouse = arrData.map(element => {
            if(element.priceInf.trim().indexOf("triệu") > 0) {
                return element;
            }
        });
        return millionHouse.filter(x => x);
    },
    getHighHouse: function(arrData, price) {
        billionHouse = arrData.map(element => {
            if(element.priceInf.trim().indexOf("tỷ") > 0) {
                if(element.priceInf.trim()[0] > price)
                return element;
            }
        });
        return billionHouse.filter(x => x);
    },
    getRateHouse: function(arrData) {
        app.get('/low-house', (request, response) => {
            
            if(request.query.data == 1) {
                response.send([...this.getLowHouse(arrData)]);
            }
            else {
                response.send([...this.getHighHouse(arrData, request.query.data)]);
            }            
            
        });
    }

}

module.exports = seller;