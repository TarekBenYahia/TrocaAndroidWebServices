/*
'user strict';
var dbConn = require('./../../config/db.config');
const mysql=require('mysql');
const express=require('express');
var uuid=require('uuid');
var crypto =require('crypto');
var app=express();
var randomstring = require('randomstring')
const bodyparser= require('body-parser');
app.use(bodyparser.json()); //accepter les parametres JSON
app.use(bodyparser.urlencoded({extended: true})) //Accepter les parametres Encoded URL
var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex') //convertir en format hexa
        .slice(0,length); //retourne le nombre voulu de caracteres


};
var sha512 = function (password,salt) {
    var hash =crypto.createHmac('sha512',salt) //utiliser sha512
    hash.update(password);
    var value =hash.digest('hex');
    return{
        salt:salt,
        passwordHash: value
    };

};
function saltHashPassword(userPassword) {
    var salt= genRandomString(16); //generer un string random avec 16 carac
    var passwordData =sha512(userPassword,salt);
    return passwordData;

}
function checkHashPassword (userPassword, salt){
    var passwordData = sha512(userPassword,salt);
    return passwordData;
}

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tarekbenyahia97@gmail.com' ,
        pass: '5254Madrid'


    }
});


//Employee object create
var Client = function(client){
    this.nomPrenomClient     = client.nomPrenomClient;
    this.emailClient      = client.emailClient;
    this.encrypted_password = client.encrypted_password;
    this.salt          = client.salt;
    this.actif          = client.actif;
    this.telClient          = client.telClient;
    this.dateNaissClient          = client.dateNaissClient;
    this.numCinClient          = client.numCinClient;
    this.CinClient          = client.CinClient;
    this.adresseClient          = client.adresseClient;
    this.note          = client.note;
    this.nbAnneeExp          = client.nbAnneeExp;
    this.CartePro          = client.CartePro;
    this.idCategorie          = client.idCategorie;
    this.roleUtilisateur          = client.roleUtilisateur;
    this.nbNote          = client.nbNote;



};

Client.create = function (newAnn, result) {
    dbConn.query("INSERT INTO annonce set ?", newAnn, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};

Client.findAll = function (result) {
    dbConn.query("Select * from client", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            console.log('clients : ', res);
            result(null, res);
        }
    });
};

Client.delete = function(emailClient, result){
    dbConn.query("DELETE FROM client WHERE emailClient = ?", [emailClient], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

Annonce.update = function(id, annonce, result){
    dbConn.query("UPDATE annonce SET titreAnnonce=?,descriptionAnnonce=?,photoAnnonce=? ,idCategorie=? WHERE idAnnonce = ?", [annonce.titreAnnonce,annonce.descriptionAnnonce,annonce.photoAnnonce,annonce.idCategorie, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }else{
            result(null, res);
        }
    });
};




module.exports= Client;
*/