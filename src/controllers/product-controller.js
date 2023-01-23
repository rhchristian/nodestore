'use strict'

const ValidationContract = require('../validators/fluent-validator');
const respository = require('../repositories/product-repository');
const config = require('../config');

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

exports.getBySlug = async(req, res, next) => {
    try{
        var data = await respository.getBySlug();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })
    }
}

exports.getById = async(req, res, next) => {
    try {
        var data = await respository.getById(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })
    }
}

exports.getByTag = async(req, res, next) => {
    try {
        var data = await respository.getByTag(req.params.tag);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })
    }
}

exports.post = async(req, res, next) => {

    let contract = new ValidationContract();

    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A descrição deve conter pelo menos 3 caracteres');
    
    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    // const blobSvc = azure.createBlobService(config.connectionString);
    
    // let filename = guid.raw().toString() + '.jpg';
    // let rawdata = req.body.image;
    // let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    // let type = matches[1];
    // let buffer = new Buffer(matches[2], 'base64');

    // await blobSvc.createBlobFromText('product-images', filename, buffer, {
    //     contentType: type
    // }, function(error, result, response){
    //     if(error){
    //         filename = 'default-product.jpg'
    //     }
    // })

    try {
        await respository.create(req.body)
        res.status(201).send({ 
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })     
    }
     
}

exports.put = async(req, res, next) => {
   
   try {
       await respository.update(req.params.id, req.body)
       res.status(200).send({
           message: 'Produto atualizado com sucesso'
       });   
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })     
    }
}

exports.delete = async(req, res, next) => {
    try {
        await respository.delete(req.body.id)
        res.status(200).send({
            message: 'Produto removido com sucesso'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })     
    }
}