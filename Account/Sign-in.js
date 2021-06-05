var dataApp = require('../export-sever/exportSever.js');
var bodyParser = require('body-parser')
const AccountModel = require('./account');

dataApp.use(bodyParser.urlencoded({ extended: false })),
dataApp.use(bodyParser.json()),


dataApp.post('/login', (req, res) => {

var username = req.body.username;
var password = req.body.password;

AccountModel.findOne({
    username: username,
    password: password
})
.then(data => {
    if (data) {
        res.json('Dang nhap thanh cong')
    }
    else {
        res.status(400).json('Dang nhap khong thanh cong')
    }
})
.catch(err => {
    res.status(500).json('Loi server')
})
}),
    
dataApp.listen(3001, () => {
        console.log('Server listen at port');
    })
