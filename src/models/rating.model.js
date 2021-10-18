'user strict';

const sql = require('./../../config/db.config');


// constructor
const Rating = function(rating) {
  this.nbEtoiles = rating.nbEtoiles;
  this.idClient = rating.idClient;
  this.idAnnonce = rating.idAnnonce;

};

Rating.create = (newRating, result) => {
  sql.query("INSERT INTO rating SET ?", newRating, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    }
    else{
                console.log(res.insertIdRating);
                result(null, res.insertIdRating);
            }

  });
};
/*
Rating.findById = (ratingId, result) => {
  sql.query(`SELECT * FROM rating WHERE idRating = ${ratingId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found Rating: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result({ kind: "not_found" }, null);
  });
};

Rating.findAll =function (result) {
                   sql.query("Select * from rating", function (err, res) {
                      if(err) {
                console.log("error: ", err);
                result(null, err);
            }
            else{
                console.log('annonces : ', res);
                result(null, res);
            }
        });
    };

Rating.updateById = (idRating, rating, result) => {
  sql.query(
    "UPDATE rating SET  nbEtoile = ?, idClient = ?, idAnnonce = ? WHERE idRating = ?",
    [ rating.nbEtoile, rating.idClient, rating.idAnnonce, idRating],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      }

      if (res.affectedRows == 0) {
       
        result({ kind: "not_found" }, null);
      }

      console.log("updated rating: ", { idRating: idRating, ...rating });
      result(null, { idRating: idRating, ...rating });
    }
  );
};

Rating.remove = (id, result) => {
  sql.query("DELETE FROM rating WHERE idRating = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
    }

    console.log("deleted rating with id: ", id);
    result(null, res);
  });
};

Rating.removeAll = result => {
  sql.query("DELETE FROM rating", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} rating`);
    result(null, res);
  });
};
*/
module.exports = Rating;