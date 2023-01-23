'use strict'


const ValidationContract = require('../validators/fluent-validator');
const respository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-services');



exports.get = async(req, res, next) => {
    try {
        var data = await respository.get();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })
    }
}


exports.post = async(req, res, next) => {
    try {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);


        console.log(data);

        await respository.create({
            customer: data.id,
            number: guid.raw().substring(0,6),
            items: req.body.items
        })
        res.status(201).send({ 
            message: 'Pedido cadastrado com sucesso!'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })     
    }
     
}