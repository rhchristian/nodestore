'use strict';


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const config = require('./config');


const app = express();
const router = express.Router();

const uri = config.connectionString;


//Connecta ao banco
mongoose.connect(uri, {useNewUrlParser: true}, (err, db) => {
    //handle
});

//carrega os models
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');


// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});


app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({extended: false}))

//carrega as Rotas
const index = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const oderRoute = require('./routes/order-route');


app.use('/', index);
app.use('/products', productRoute); 
app.use('/customers', customerRoute); 
app.use('/orders', oderRoute); 


module.exports = app;