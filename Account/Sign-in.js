var dataApp = require('../export-sever/exportSever.js');
var bodyParser = require('body-parser')
const AccountModel = require('./account');
var jwt = require('jsonwebtoken');

dataApp.use(bodyParser.urlencoded({ extended: false })),
dataApp.use(bodyParser.json()),

module.exports = function SignIn() {
    dataApp.post('/login', (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        AccountModel.findOne({
            username: username,
            password: password
        })
        
        .then(data => {
            const token = jwt.sign({user: data}, 'token_authen')
            if (data) {
                res.json(token)
            }
            else {
                res.status(400).json('Dang nhap khong thanh cong')
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json('Loi server')
        })
        })
}

