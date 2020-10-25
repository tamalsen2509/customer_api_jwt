require('dotenv').config()
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

let db = mongoose.connection;
db.on('error', console.error.bind(console,'Mogodb connection Error: '));
db.once('open',()=> { console.log ( 'connected to Mongo DB!')});



module.exports = db; 



