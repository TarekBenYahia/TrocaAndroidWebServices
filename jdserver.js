var express = require("express");
var app = express();
var multer, storage, path, crypto;
const mysql=require('mysql');
multer = require('multer')
path = require('path');
crypto = require('crypto');

var mysqlConnection =mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database :'test'

});

mysqlConnection.connect((err)=>{
    if (!err) console.log('DB Connection Succeed')
    else console.log('DB Connection Failed\n Error: '+JSON.stringify(err,undefined,2));
});

var form = "<!DOCTYPE HTML><html><body>" +
    "<form method='post' action='/upload' enctype='multipart/form-data'>" +
    "<input type='file' name='upload'/>" +
    "<input type='submit' /></form>" +
    "</body></html>";

app.get('/', function (req, res){
    res.writeHead(200, {'Content-Type': 'text/html' });
    res.end(form);

});

// Include the node file module
var fs = require('fs');

storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        return crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) {
                return cb(err);
            }
            return cb(null,"" + (raw.toString('hex')) + (path.extname(file.originalname)));
        });
    }
});


// Post files
app.post(
    "/upload",
    multer({
        storage: storage
    }).single('upload'), function(req, res) {
        mysqlConnection.query('INSERT INTO `testImage` (`image`) VALUES (?)',[req.file.filename],function (err,result,fields) {
            mysqlConnection.on('error',function (err) {
                console.log('[MySQL ERROR]',err);
                res.json('register error',err);
            });
            console.log(req.file);
            console.log(req.body);
            res.redirect("/uploads/" + req.file.filename);
            console.log(req.file.filename);
            return res.status(200).end();
        });

    });

app.get('/uploads/:upload', function (req, res){
    file = req.params.upload;
    console.log(req.params.upload);
    var img = fs.readFileSync(__dirname + "/uploads/" + file);
    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(img, 'binary');

});


app.listen(3000);

