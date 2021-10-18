'use strict';

const Rating = require('../models/rating.model');

exports.findAll = function(req, res) {
  Rating.findAll(function(err, rating) {
    console.log('controller')
    if (err)
    res.send(err);
        console.log('res', rating);
        res.send(rating);
  });
};


exports.create = function(req, res) {
    const new_rating = new Rating(req.body);

    //handles null error
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Rating.create(new_rating, function(err, rating) {
            if (err)
            res.send(err);
            res.json({error:false,message:"rating added successfully!",data:rating});
        });
    }
};




exports.update = function(req, res) {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Rating.update(req.params.id, new Rating(req.body), function(err, rating) {
            if (err)
            res.send(err);
            res.json({ error:false, message: 'rating successfully updated' });
        });
    }

};


exports.delete = function(req, res) {
  Rating.delete( req.params.id, function(err, user) {
    if (err)
    res.send(err);
    res.json({ error:false, message: 'RATING successfully deleted' });
  });
};