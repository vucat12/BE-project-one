const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DoAn1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: String,
    password: String,
}, {
    collection: 'account'
});

const AccountModel = mongoose.model('account', AccountSchema)

module.exports = AccountModel;