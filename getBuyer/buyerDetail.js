var dataApp = require('../export-sever/exportSever.js')

var buyerDetail = {
  getBuyerDetail: function (err, data) {
    if (err) throw err;
    else {
      this.getBuyerDetailById(data);
    }
  },
  getBuyerDetailById: function (data) {
    dataApp.get('/buyer/:id/detail', (request, response) => {
      response.send(data);
    }
    );
  }
}

module.exports = buyerDetail;