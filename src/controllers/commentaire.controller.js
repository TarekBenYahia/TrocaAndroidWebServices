'use strict';

const Commentaire = require('../models/commentaire.model');

exports.findAll = function(req, res) {
  Commentaire.findAll(function(err, commentaire) {
    console.log('controller')
    if (err)
    res.send(err);
        console.log('res', commentaire);
        res.send(commentaire);
  });
};


exports.create = function(req, res) {
    const new_com = new Commentaire(req.body);

    //handles null error
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Commentaire.create(new_com, function(err, commentaire) {
            if (err)
            res.send(err);
            res.json({error:false,message:"Commentaire added successfully!",data:commentaire});
        });
    }
};




exports.update = function(req, res) {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Commentaire.update(req.params.id, new Commentaire(req.body), function(err, commentaire) {
            if (err)
            res.send(err);
            res.json({ error:false, message: 'Commentaire successfully updated' });
        });
    }

};


exports.like = function(req, res) {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Commentaire.updateById(req.params.id, new Commentaire(req.body), function(err, commentaire) {
            if (err)
            res.send(err);
            res.json({ message: 'Commentaire successfully updated' });
        });
    }

};

exports.dislike = function(req, res) {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Commentaire.updateByIdand(req.params.id, new Commentaire(req.body), function(err, commentaire) {
            if (err)
            res.send(err);
            res.json({  message: 'Commentaire successfully updated' });
        });
    }

};


exports.delete = function(req, res) {
  Commentaire.delete( req.params.id, function(err, user) {
    if (err)
    res.send(err);
    res.json({ message: 'Commentaire successfully deleted' });
  });
};