const express = require('express')
const router = express.Router()
const mysql=require('mysql');
var mysqlConnection =mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database :'miniprojet'});

const commentaireController = require('../controllers/commentaire.controller');

// Retrieve all employees
router.get('/', commentaireController.findAll);

// Create a new employee
router.post('/', commentaireController.create);

//like
router.put('/:id/like', commentaireController.like);
//dislike

router.put('/:id/dislike', commentaireController.dislike);

// Retrieve a single employee with id
//router.get('/:id', employeeController.findById);

// Update a employee with id
router.put('/:id', commentaireController.update);

// Delete a employee with id
router.delete('/:id', commentaireController.delete);

router.post('/getcommentairebyidannonce/',(request,response)=>{
    const idAnnonce = request.body.idAnnonce;
    mysqlConnection.query('SELECT * FROM commentaire WHERE idAnnonce = ? order by idCommentaire desc ',[idAnnonce],(err,rows,fields)=>{
        if(!err)
            response.send(rows);
        else console.log(err)
    })
});


router.post('/addcomment',(request,response)=>{
    const idClient = request.body.idClient;
    const idAnnonce = request.body.idAnnonce;
    const Contenu = request.body.Contenu;
    mysqlConnection.query('insert into commentaire (Contenu,idClient,idAnnonce) values(?,?,?)',[Contenu,idClient,idAnnonce],
        (err,rows,fields)=>{
            if(!err)
                response.send(rows);
            else console.log(err)
        }
    )
});

module.exports = router