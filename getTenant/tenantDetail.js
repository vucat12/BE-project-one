var dataApp = require('../export-sever/exportSever.js')

var tenantDetail = {
  getTenantDetail: function (err, data) {
    if (err) throw err;
    else {
      this.getTenantDetailById(data);
    }
  },
  getTenantDetailById: function (data) {
    dataApp.get('/tenant/:id/detail', (request, response) => {
      const result = data.filter(el => el._id == request.params.id)[0]
      response.send(result)
      return;
    }
    );
  }
}

module.exports = tenantDetail;