const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.connect('mongodb://localhost:27017/xmeme', { useNewUrlParser: true, useFindAndModify: false });
mongoose.set("useCreateIndex", true);
const memeschema = new mongoose.Schema({
    _id: Number,
    name: String,
    url: String,
    caption: String
}, { _id: false });
memeschema.plugin(AutoIncrement);
const Memes = new mongoose.model('Memes', memeschema);

module.exports = Memes;