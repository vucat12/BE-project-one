var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var seller = require('./getSeller/seller.js')
var buyer = require('./getBuyer/buyer.js')
var lessor = require('./getLessor/lessor.js')
var tenant = require('./getTenant/tenant.js')
var dataApp = require('./export-sever/exportSever.js')
var postDetail = require('./crawl-data/getPost.js')
var signIn = require('./Account/Sign-in');
var signUp = require('./Account/Sign-up');

const port = 3002;

MongoClient.connect(url, function(err, db) {
if (err) throw err;
var dbo = db.db("DoAn1");

signIn();
signUp();
dbo.collection("CanBan").find({}).toArray((err, res) => seller.getSeller(err,res));
dbo.collection("CanMua").find({}).toArray((err, res) => buyer.getBuyer(err,res));
dbo.collection("ChoThue").find({}).toArray((err, res) => lessor.getLessor(err,res));
dbo.collection("CanThue").find({}).toArray((err, res) => tenant.getTenant(err,res));

postDetail.getPostDetail();

const server = dataApp.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    console.log(`Server listening on port ${server.address().port}`);
});
})