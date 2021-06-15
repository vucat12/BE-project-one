var dataApp = require('../export-sever/exportSever.js');
var bodyParser = require('body-parser')
const AccountModel = require('./account');

dataApp.use(bodyParser.urlencoded({ extended: false }))
dataApp.use(bodyParser.json())


module.exports = function SignUp() {
    dataApp.post('/register', (req, res) => {

        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;

        AccountModel.findOne({
            username: username
        })
            .then(data => {
                if (data) {
                    res.status(500).json('Tên tài khoản đã tồn tại')
                }
                else {
                    res.json('Tạo tài khoản thành công')
                    return AccountModel.create(
                        {
                            username: username,
                            password: password,
                            email: email,
                        }
                    )
                }
            })
            .catch(err => {
                res.status(500).json('Tạo tài khoản thất bại')
            })
    })
}
