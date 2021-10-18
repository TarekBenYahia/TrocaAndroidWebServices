'user strict';
var dbConn = require('./../../config/db.config');

//Employee object create
var Annonce = function(annonce){
    this.titreAnnonce     = annonce.titreAnnonce;
    this.descriptionAnnonce      = annonce.descriptionAnnonce;
    this.dateAnnonce          = new Date();;
    this.photoAnnonce          = annonce.photoAnnonce;
    this.idClient          = annonce.idClient;
    this.idCategorie          = annonce.idCategorie;


};
Annonce.create = function (newAnn, result) {
    dbConn.query("INSERT INTO annonce set ?", newAnn, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            //console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};

Annonce.findAll = function (result) {
    dbConn.query("Select * from annonce", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
           // console.log('annonces : ', res);
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
Annonce.delete = function(id, result){
     dbConn.query("DELETE FROM annonce WHERE idAnnonce = ?", [id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    }); 
};

module.exports= Annonce;