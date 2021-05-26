var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var seller = require('./getSeller/seller.js')
var buyer = require('./getBuyer/buyer.js')
var dataApp = require('./export-sever/exportSever.js')
const port = 3002;

MongoClient.connect(url, function(err, db) {
if (err) throw err;
var dbo = db.db("Project-1");

dbo.collection("CanBan").find({}).toArray((err, res) => seller.getSeller(err,res));
dbo.collection("CanMua").find({}).toArray((err, res) => buyer.getBuyer(err,res));

const server = dataApp.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});
})