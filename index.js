var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var seller = require('./getSeller/seller.js')

MongoClient.connect(url, function(err, db) {
if (err) throw err;
var dbo = db.db("Project-1");

dbo.collection("CanBan").find({}).toArray((err, res) => seller.getSeller(err,res));

});