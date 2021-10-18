
/*'use strict';

const Client = require('../models/client.model');

exports.findAll = function(req, res) {
    Client.findAll(function(err, client) {
        console.log('controller')
        if (err)
            res.send(err);
        console.log('res', client);
        res.send(client);
    });
};
exports.delete = function(req, res) {
    Client.delete( req.params.emailClient, function(err, user) {
        if (err)
            res.send(err);
        res.json({ error:false, message: 'Client Supprimé avec succès' });
    });
};

/*
exports.create = function(req, res) {
    const new_annonce = new Annonce(req.body);

    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Annonce.create(new_annonce, function(err, annonce) {
            if (err)
                res.send(err);
            res.json({error:false,message:"Annonce added successfully!",data:annonce});
        });
    }
};




exports.update = function(req, res) {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Annonce.update(req.params.id, new Annonce(req.body), function(err, annonce) {
            if (err)
                res.send(err);
            res.json({ error:false, message: 'Annonce successfully updated' });
        });
    }

};




 */