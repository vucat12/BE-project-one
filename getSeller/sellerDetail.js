var dataApp = require('../export-sever/exportSever.js')

var sellerDetail = {
  getSellerDetail: function (err, data) {
    if (err) throw err;
    else {
      this.getSellerDetailById(data);
    }
  },
  getSellerDetailById: function (data) {
    dataApp.get('/seller/:id/detail', (request, response) => {
      const result = data.filter(el => el._id == request.params.id)[0]
      response.send(result)
      return;
    }
    );
  }
}

module.exports = sellerDetail;