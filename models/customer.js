let mongoose = require('mongoose');
let moment = require('moment');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
require('dotenv').config()


let customerSchema = new mongoose.Schema({
    ID : {
        type : Number,
        required : true,
        unique : true,
        default : parseInt(moment(new Date()).format('mmssSSS'))

    },

    firstname : {
        type : String,
        required : true,
    },
    lastname : {
        type : String,    
    },
    email : {
        type : String,
        trim : true,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
    },
    
    phone : {
        type : String,
        trim : true,
        required : true,
    },
    address : {
        type : String,
        required : true
    },
    updateTimestamp : {
        type : Date,
        default : Date.now()
    }

})



customerSchema.methods.GenerateJWTToken = function (callback){

    bcrypt.hash(this.password, 10 , (err,hash_pw)=>{
        this.password = hash_pw;
        this.save()
        .then(result => { console.log (result);
        callback({
            success : "Success",
            token : jwt.sign({email : this.email, password : this.password}, process.env.token_secret,(err,sec)=> { console.log(sec) })
                })    
        })
        .catch(err => {
            callback ({
                Status : 'Error',
                ErrorDetails : err
            })  
        })
    
    })
}


customerSchema.statics.verifyJWTToken = function (token) {
    let decoded ;
    try {
        decoded = jwt.verify(token , process.env.token_secret)
        return Promise.resolve(decoded)
    } catch (error) {
        return Promise.reject(error)
    }
}
module.exports = mongoose.model('Customer', customerSchema )