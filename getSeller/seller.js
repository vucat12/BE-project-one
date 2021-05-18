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

            this.getAreaPercent(data);

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
                if(element.priceInf.trim()[0] >= price)
                return element;
            }
            if(!!!price) {
                return element;
            }
        });
        return billionHouse.filter(x => x);
    },
    getRateHouse: function(arrData) {
        app.get('/rate-house', (request, response) => {
            
            if(request.query.data) {
                if(request.query.data == 1) {
                    response.send([...this.getLowHouse(arrData)]);
                }
                
                if(request.query.data > 1) {
                    response.send([...this.getHighHouse(arrData, request.query.data)]);
                }
            }
            else {
                response.send([...this.getHighHouse(arrData), ...this.getLowHouse(arrData)]);
            }
        });
    },
    getAreaPercent: function(arrData) {
        const areaPercent = arrData.map(el => {
            element = el.areaInf.substring(0, el.areaInf.length - 3);
            return element.replace('.', '');
        });
        let dataPercent = Array.apply(null, Array(13)).map(Number.prototype.valueOf,0);
        dataPercent.fill(0);
        areaPercent.forEach(element => {
            if(element >= 30 && element <= 50) dataPercent[0]++;
            if(element >= 50 && element <= 70) dataPercent[1]++;
            if(element >= 70 && element <= 100) dataPercent[2]++;
            if(element >= 100 && element <= 150) dataPercent[3]++;
            if(element >= 150 && element <= 200) dataPercent[4]++;
            if(element >= 200 && element <= 250) dataPercent[5]++;
            if(element >= 250 && element <= 300) dataPercent[6]++;
            if(element >= 300 && element <= 350) dataPercent[7]++;
            if(element >= 350 && element <= 400) dataPercent[8]++;
            if(element >= 400 && element <= 600) dataPercent[9]++;
            if(element >= 600 && element <= 800) dataPercent[10]++;
            if(element >= 800 && element <= 1000) dataPercent[11]++;
            if(element >= 1000) dataPercent[12]++;
        });
        dataPercent = dataPercent.map(el => (el*100)/ arrData.length);
        app.get('/area-percent', (request, response) => {
            response.send(dataPercent);
        });
    },

}

module.exports = seller;