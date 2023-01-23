'use strict'


const ValidationContract = require('../validators/fluent-validator');
const respository = require('../repositories/customer-repository');
const emailService = require('../services/mail-service');
const authService = require('../services/auth-services');


const md5 = require('md5');

exports.post = async(req, res, next) => {

    let contract = new ValidationContract();

    contract.hasMinLen(req.body.name, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email,'O email é inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await respository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles:['user']
        })

        emailService.send(req.body.email, 'Bem vindo ao Node Store', global.EMAIL_TMPL.replace('{0}', req.body.name))

        res.status(201).send({ 
            message: 'Cliente cadastrado com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })     
    }
     
}

exports.authenticate = async(req, res, next) => {

    try {
        const customer = await respository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        })
        
        if(!customer){
            res.status(404).send({ 
                message: 'Usuário ou senha Inválidos'
            });
            return;
        }

        authService.generateToken({ 
            email: customer.email, 
            name: customer.name
        });

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        })

        res.status(201).send({ 
            token: token, 
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })     
    }
     
}

exports.refreshToken = async(req, res, next) => {

    try {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await respository.getById(data.id)
        
        if(!customer){
            res.status(404).send({ 
                message: 'Cliente não encontrado'
            });
            return;
        }

        authService.generateToken({ 
            email: customer.email, 
            name: customer.name
        });

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        })

        res.status(201).send({ 
            token: tokenData, 
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        })     
    }
     
}