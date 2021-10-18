'user strict';
var dbConn = require('./../../config/db.config');

//Employee object create
var Commentaire = function(commentaire){
    this.Contenu     = commentaire.Contenu;
    this.idClient          = commentaire.idClient;
    this.idAnnonce      = commentaire.idAnnonce;
        this.nbrLike      = commentaire.nbrLike;

    };




Commentaire.create = function (newComm, result) {
    dbConn.query("INSERT INTO commentaire set ?", newComm, function (err, res) {
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

Commentaire.findAll = function (result) {
    dbConn.query("Select * from commentaire", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            console.log('Commentaires : ', res);
            result(null, res);
        }
    });
};

Commentaire.update = function(id, commentaire, result){
  dbConn.query("UPDATE commentaire SET Contenu=? WHERE idCommentaire = ?", [commentaire.Contenu, id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }else{
            result(null, res);
        }
    });
};

Commentaire.updateById = function(id, commentaire,result){
  dbConn.query("UPDATE commentaire SET nbrLike=nbrLike + 1 WHERE idCommentaire = ?", [ id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }else{
                        result(commentaire, res);
        }
    });
};

Commentaire.updateByIdand = function(id, commentaire,result){
  dbConn.query("UPDATE commentaire SET nbrLike=nbrLike - 1 WHERE idCommentaire = ?", [ id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }else{
                        result(commentaire, res);
        }
    });
};


Commentaire.delete = function(id, result){
     dbConn.query("DELETE FROM commentaire WHERE idCommentaire = ?", [id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    });
};

module.exports= Commentaire;