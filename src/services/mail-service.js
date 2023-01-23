'use strict'

var config = require('../config');
var sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(config.sendgridKey);

exports.send = async(to, subject, body) => {
    sendgrid.send({
        to:to, 
        from: 'rhchristian.k@gmail.com',
        subject: subject,
        text: 'and easy to do anywhere, even with Node.js',
        html: body
    })
    .then((response) => {
       console.log('Email sent');
    //    console.log(response[0].statusCode);
    //    console.log(response[0].headers);
    })
    .catch((error) => {
        console.error(error)
    })
}