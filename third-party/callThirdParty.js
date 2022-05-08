var dataApp = require('../export-sever/exportSever.js')
const axios = require('axios');

var thirdParty = {
    callThirdParty: function () {
        this.thirdParty();
    },
    thirdParty: function () {
        dataApp.get('/third-party', (req, res) => {
            const url = 'http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh'

            axios({
                method: 'get',
                url,
            })
                .then(function (response) {
                    res.send(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });


        })
    }
}

module.exports = thirdParty;