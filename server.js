let express = require('express');
let app = express();
let Customer = require('./models/customer');
let bodyparser = require('body-parser');
let DB = require('./db/monggose');
let jwt = require('jsonwebtoken');
let port = process.env.PORT ||  3000;
let bcrypt = require('bcrypt');
require('dotenv').config();
const customer = require('./models/customer');





app.use(bodyparser.json());

app.post('/customer/create' , (req,res)=> {
    let customer = new Customer (req.body);

    customer.GenerateJWTToken ((result) => {
        if (result.status == "Success"){
            res.json(result)
        } else {
            res.status(400).send(result.ErrorDetails)
        }
    })
    //res.status(200).send(result)
})

app.get('/customers', (req,res)=> { 

    customer.verifyJWTToken(req.header('X-Auth'))
    .then(result => {
        return customer.find({})
    })

    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).send(err))
})


app.get('/customer/:id', (req,res)=> {
    Customer.verifyJWTToken(req.header('X-Auth'))
    .then(result => { 
        return Customer.findOne({"ID": req.params.id });
    })
    
    .then(result => res.status(200).send(result))
    .catch(err=> res.status(400).send(err))
})


app.patch('/customer/:id',(req,res)=> {
    req.body.updateTimestamp = Date.now();
    Customer.verifyJWTToken(req.header('X-Auth'))
    .then(result => {
        return Customer.findOneAndUpdate({"ID" : req.params.id},req.body)
    })    
    .then(result=> res.status(200).send(result))
    .catch(err => res.status(400).send(err))
})




app.listen(port , ()=> { 
    console.log('app is listening at port ' + port )
})
