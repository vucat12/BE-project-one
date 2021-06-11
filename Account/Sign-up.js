var dataApp = require('../export-sever/exportSever.js');
var bodyParser = require('body-parser')
const AccountModel = require('./account');

dataApp.use(bodyParser.urlencoded({ extended: false }))
dataApp.use(bodyParser.json())


module.exports = function SignUp() {
    dataApp.post('/register', (req, res) => {

        var username = req.body.username;
        var password = req.body.password;
    
        AccountModel.findOne({
            username: username
        })
            .then(data => {
                if (data) {
                    res.json('user da ton tai')
                }
                else {
                    return AccountModel.create(
                        {
                            username: username,
                            password: password,
                        }
                    )
                }
            })
            .then(data => {
                res.json('Tao tai khoan thanh cong')
            })
            .catch(err => {
                res.status(500).json('Tao tai khoan that bai')
            })
    })
}
