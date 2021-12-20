var dataApp = require('../export-sever/exportSever.js')

var seller = {
    getSeller: function(err, data){
        if (err) throw err;
        else {
            this.getRateHouse(data);
            this.getAreaPercent(data);
            this.getValueByProvince(data);
            this.getRateArea(data);
            this.identicalPrice(data)
        }
    },
    countData: function(arrData) {
        const areaPercent = arrData.map(el => {
            element = el.areaInf.substring(0, el.areaInf.length - 3);
            return element.replace('.', '');
        });
        let dataPercent = Array.apply(null, Array(13)).map(Number.prototype.valueOf,0);
        dataPercent.fill(0);
        areaPercent.forEach(element => {
            if(element >= 30 && element < 50) dataPercent[0]++;
            if(element >= 50 && element < 70) dataPercent[1]++;
            if(element >= 70 && element < 100) dataPercent[2]++;
            if(element >= 100 && element < 150) dataPercent[3]++;
            if(element >= 150 && element < 200) dataPercent[4]++;
            if(element >= 200 && element < 250) dataPercent[5]++;
            if(element >= 250 && element < 300) dataPercent[6]++;
            if(element >= 300 && element < 350) dataPercent[7]++;
            if(element >= 350 && element < 400) dataPercent[8]++;
            if(element >= 400 && element < 600) dataPercent[9]++;
            if(element >= 600 && element < 800) dataPercent[10]++;
            if(element >= 800 && element < 1000) dataPercent[11]++;
            if(element >= 1000) dataPercent[12]++;
        });

        const sumHousesSeller = dataPercent;
        dataPercent = dataPercent.map(el => (el*100)/ arrData.length);

        return { dataPercent: dataPercent, sumHouses: sumHousesSeller};
    },
    getAreaPercent: function(arrData) {
        dataApp.get('/seller/area-percent', (request, response) => {
            response.send(this.countData(arrData));
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
                if(!price) {
                    return element;
                }
                if(price == 5 && parseInt(element.priceInf.trim().slice(0,-3).replace(',','.')) >= price) return element;
                else if(element.priceInf.trim().slice(0,-3).replace(',','.') >= price-1 && element.priceInf.trim().slice(0,-3).replace(',','.') <= price && parseInt(element.priceInf.trim().slice(0,-3).replace(',','.')) < 10)
                return element;
            }
            
        });
        return billionHouse.filter(x => x);
    },
    getRateHouse: function(arrData) {
        dataApp.get('/seller/rate-house', (request, response) => {
            let result = [];
            if(request.query.data) {
                if(request.query.data == 1) {
                    result = [...this.getLowHouse(arrData)].filter(element => this.getAreaValue(arrData, request.query.area).includes(element));
                    result = result.filter(element => this.getProvinceValue(arrData, request.query.province).includes(element));
                    result = result.filter(element => this.getDictrictValue(arrData, request.query.district).includes(element));
                    response.send(result);
                }
                
                if(request.query.data > 1) {
                    result = [...this.getHighHouse(arrData, request.query.data)].filter(element => this.getAreaValue(arrData, request.query.area).includes(element));
                    result = result.filter(element => this.getProvinceValue(arrData, request.query.province).includes(element));
                    result = result.filter(element => this.getDictrictValue(arrData, request.query.district).includes(element));
                    response.send(result);
                }
            }
            else {
                result = [...this.getHighHouse(arrData, 0), ...this.getLowHouse(arrData)].filter(element => this.getAreaValue(arrData, request.query.area).includes(element));
                result = result.filter(element => this.getProvinceValue(arrData, request.query.province).includes(element));
                result = result.filter(element => this.getDictrictValue(arrData, request.query.district).includes(element));
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
    },
    getDictrictValue: function(arrData, dictrictValue) {
        if(!!!dictrictValue) return arrData;
        let data = arrData.map(el => {
            if(el.addressInf.indexOf(dictrictValue)>0) {
                return el;
            }
        })
        return data;
    },
    getValueByProvince: function(arrData) {
        dataApp.get('/seller/value-search-province', (request, response) => {
            const init = this.getProvinceValue(arrData, request.query.province).filter(x => x);
            const countData = this.countData(init);
            response.send(countData)
        })
    },
    countRateArea: function(arrData) {
        let dataPercent = Array.apply(null, Array(5)).map(Number.prototype.valueOf,0);
        dataPercent.fill(0);
        dataPercent[0] = this.getLowHouse(arrData).length;

        arrData.map(element => {
            if(element.priceInf.trim().indexOf("tỷ") > 0) {
                const init = parseFloat(element.priceInf.trim().slice(0,-3).replace(',','.'));
                if(init>=1 && init<=2) dataPercent[1]++;
                else if(init>=2 && init<=3) dataPercent[2]++;
                else if(init>=3 && init<=4) dataPercent[3]++;
                else if(init>=4) dataPercent[4]++;
            }
        });
        const sumArea = dataPercent;
        dataPercent = dataPercent.map(el => (el*100)/ arrData.length);
        return { dataPercent: dataPercent, sumHouses: sumArea }
    },
    getRateArea: function(arrData) {
        dataApp.get('/seller/price-data', (request, response) => {
            const init = this.getProvinceValue(arrData, request.query.province).filter(x => x);
            const countData = this.countRateArea(init);
            response.send(countData)
        });
    },

    identicalPrice: function(arrData) {
        dataApp.get('/seller/identical-price', (request, response) => {
            //25/10  1/11  8/11  15/11  19/11
            const arrFilteredProvince_Week1 = this.getRequestByDateAndProvince(arrData, "25/10/2021", request.query.province)
            const averageValue_Week1 =  this.filterDataPircePerArea(arrFilteredProvince_Week1);

            const arrFilteredProvince_Week2 = this.getRequestByDateAndProvince(arrData, "1/11/2021", request.query.province)
            const averageValue_Week2 =  this.filterDataPircePerArea(arrFilteredProvince_Week2);

            const arrFilteredProvince_Week3 = this.getRequestByDateAndProvince(arrData, "8/11/2021", request.query.province)
            const averageValue_Week3 =  this.filterDataPircePerArea(arrFilteredProvince_Week3);
            
            const arrFilteredProvince_Week4 = this.getRequestByDateAndProvince(arrData, "15/11/2021", request.query.province)
            const averageValue_Week4 =  this.filterDataPircePerArea(arrFilteredProvince_Week4);
            
            const arrFilteredProvince_Week5 = this.getRequestByDateAndProvince(arrData, "19/11/2021", request.query.province)
            const averageValue_Week5 =  this.filterDataPircePerArea(arrFilteredProvince_Week5);

            const arrResult = [averageValue_Week1, averageValue_Week2, averageValue_Week3, averageValue_Week4, averageValue_Week5]
            response.send([...arrResult, this.futurePrice(arrResult)]);
        });
    },
    getRequestByDateAndProvince(rootValue, date, province) {
        return result = rootValue.filter(el => el.postDate == date && el.addressInf.indexOf(province) > 0)
    },
    filterDataPircePerArea(dataFilter) {
        let pricePerArea = dataFilter.map(el => {
            if(el.priceInf.trim().indexOf("triệu / m2") > 0) {
                return parseFloat(Number(el.priceInf.trim().slice(0, -11).replace(',', '.')).toFixed(1));
            }
            else if(el.priceInf.trim().indexOf("tỷ") > 0) {
                const price = parseFloat(Number(el.priceInf.trim().slice(0, -3).replace(',', '.')).toFixed(1));
                const area = Number(el.areaInf.trim().slice(0, -3).replace('.',''));
                return (price*1000)/area;
            }
        }).filter(el => el);
        const average = pricePerArea.reduce((p, c) => p + c, 0) / pricePerArea.length;
        return average.toFixed(1);
    },
    futurePrice(arrResult) {
        return (arrResult.reduce((p, c) => Number(p) + Number(c), 0) / arrResult.length).toFixed(1)
    },
    
}

module.exports = seller;