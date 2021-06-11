var dataApp = require('../export-sever/exportSever.js')

var lessor = {
    getLessor: function (err, data) {
        if (err) throw err;
        else {
            this.getRateHouse(data);
            this.getAreaPercent(data);           
        }
    },

    getAreaPercent: function (arrData) {
        const areaPercent = arrData.map(el => {
            element = el.areaInf.substring(0, el.areaInf.length - 3);
            return element.replace('.', '');
        });
        let dataPercent = Array.apply(null, Array(13)).map(Number.prototype.valueOf, 0);
        dataPercent.fill(0);
        areaPercent.forEach(element => {
            if (element >= 30 && element <= 50) dataPercent[0]++;
            if (element >= 50 && element <= 70) dataPercent[1]++;
            if (element >= 70 && element <= 100) dataPercent[2]++;
            if (element >= 100 && element <= 150) dataPercent[3]++;
            if (element >= 150 && element <= 200) dataPercent[4]++;
            if (element >= 200 && element <= 250) dataPercent[5]++;
            if (element >= 250 && element <= 300) dataPercent[6]++;
            if (element >= 300 && element <= 350) dataPercent[7]++;
            if (element >= 350 && element <= 400) dataPercent[8]++;
            if (element >= 400 && element <= 600) dataPercent[9]++;
            if (element >= 600 && element <= 800) dataPercent[10]++;
            if (element >= 800 && element <= 1000) dataPercent[11]++;
            if (element >= 1000) dataPercent[12]++;
        });

        const sumHousesLessor = dataPercent;
        dataPercent = dataPercent.map(el => (el * 100) / arrData.length);
        dataApp.get('/lessor/area-percent', (request, response) => {
            response.send({ dataPercent: dataPercent, sumHouses: sumHousesLessor });
        });
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
                if(price == 5 && parseInt(element.priceInf.trim().slice(0,-3).replace(',','.')) >= price) return element;
                if(parseInt(element.priceInf.trim().slice(0,-3).replace(',','.')) >= price-1 && parseInt(element.priceInf.trim().slice(0,-3).replace(',','.')) <= price)
                return element;
            }
            if(!!!price) {
                return element;
            }
        });
        return billionHouse.filter(x => x);
    },
    getRateHouse: function(arrData) {
        dataApp.get('/lessor/rate-house', (request, response) => {
            this.getProvinceValue(arrData, request.query.province);
            let result = [];
            if(request.query.data) {
                if(request.query.data == 1) {
                    result = [...this.getLowHouse(arrData)].filter(element => this.getAreaValue(arrData, request.query.area).includes(element));
                    result = result.filter(element => this.getProvinceValue(arrData, request.query.province).includes(element));
                    response.send(result);
                }
                
                if(request.query.data > 1) {
                    result = [...this.getHighHouse(arrData, request.query.data)].filter(element => this.getAreaValue(arrData, request.query.area).includes(element));
                    result = result.filter(element => this.getProvinceValue(arrData, request.query.province).includes(element));
                    response.send(result);
                }
            }
            else {
                result = [...this.getHighHouse(arrData), ...this.getLowHouse(arrData)].filter(element => this.getAreaValue(arrData, request.query.area).includes(element));
                result = result.filter(element => this.getProvinceValue(arrData, request.query.province).includes(element));
                response.send(result);
            }
        });
    },
    getAreaValue: function(arrData, areaValue) {
        if(!!!areaValue) {
            return arrData;
        }

        const init = areaValue.indexOf("-");
        const sizeValue = {
            low: parseInt(areaValue.substring(0, init)),
            high: parseInt(areaValue.substring(init+1, areaValue.length))
        }
        let areaData = arrData.map(el => {
            initValue = parseInt(el.areaInf.substring(0, el.areaInf.length - 3).replace('.',''));
            if(initValue >= sizeValue.low && initValue <= sizeValue.high) {
                
                return el;
            }
        })
        return areaData.filter(x => x);
    },
    getProvinceValue: function(arrData, provinceValue) {
        if(!!!provinceValue) return arrData;
        let data = arrData.map(el => {
            if(el.addressInf.indexOf(provinceValue) > 0) {
                return el;
            }
        });
        return data;
    }
}
module.exports = lessor;