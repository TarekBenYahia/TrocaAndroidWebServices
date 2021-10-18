const mysql=require('mysql');
const express=require('express');
var uuid=require('uuid');
var crypto =require('crypto');
var app=express();
var randomstring = require('randomstring')
const bodyparser= require('body-parser');
app.use(bodyparser.json()); //accepter les parametres JSON
app.use(bodyparser.urlencoded({extended: true})) //Accepter les parametres Encoded URL


var mysqlConnection =mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database :'miniprojet'

});
mysqlConnection.connect((err)=>{
    if (!err) console.log('DB Connection Succeed')
    else console.log('DB Connection Failed\n Error: '+JSON.stringify(err,undefined,2));
});
app.listen(3001,()=>console.log('Express server connected 3000'));

//Récupérer tous les éléments de la table
app.get('/professionnel',(request,response)=>{
    mysqlConnection.query('select * from professionnel',(err,rows,fields)=>{
        if(!err)
            response.send(rows);
        else console.log(err)
    })
});

app.get('/RecherchePros/:emailPro',(request,response)=>{
    mysqlConnection.query('select * from professionnel where emailPro = ?',[request.params.emailPro],(err,rows,fields)=>{
        if(!err)
            response.send(rows);
        else console.log(err)
    })
});

//Récupérer un pro selon son email

app.get('/RecherchePro/:emailPro',(request,response)=>{
    mysqlConnection.query('select * from professionnel where emailPro = ?',[request.params.emailPro],(err,rows,fields)=>{
        if(!err)
            response.send(rows);
        else console.log(err)
    })
});

//Supprimer un employé
app.delete('/tests/:id',(request,response)=>{
    mysqlConnection.query('delete From test where id = ?',[request.params.id],(err,rows,fields)=>{
        if(!err)
            response.send('Supprimé avec succès');
        else console.log(err)
    })
});
//Mot de Passe
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

app.get("/pass",(req,res,next)=>{
    console.log('password : 123456');
    console.log('encrypt: ' + saltHashPassword("titi").passwordHash);
    console.log('salt: ' + saltHashPassword("titi").salt);

});
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tarekbenyahia97@gmail.com' ,
        pass: '5254Madrid'


    }
});

//inscription Client
app.post('/inscriptionPro/',(req,res,next)=>{
    var post_data=req.body;//get post params
    var uid= uuid.v4();
    var plaint_password=post_data.password; // get password from post params

    var hash_data=saltHashPassword(plaint_password);
    var password= hash_data.passwordHash; //get hash value
    var salt =hash_data.salt; //get salt

    var name =post_data.name;
    var email= post_data.email;
    var emailToken=crypto.randomBytes(64).toString('hex');
    var tel= parseInt(post_data.tel,10);
    var dateN=post_data.dateN;
    var numCIN= parseInt(post_data.numCIN,10)
    var cin= post_data.cin;
    var adresse = post_data.adresse;
    var nbAnnee = parseInt(post_data.nbAnnee,10);
    var cartePro=post_data.cartePro;
    var idC = post_data.idCategorie;
    var noteP = 5.0;
    var nbNoteP = 1;


    //var id= post_data.id;
    //console.log(name);
    mysqlConnection.query('SELECT * FROM `professionnel` where emailPro=?',[email],function (err,result,fields) {
        mysqlConnection.on('error',function (err) {
            console.log('[MySQL ERROR]',err)
        });
        if (result && result.length)
            res.json('User already exists!!');
        else {
            var noteP = 5.0;
            var nbNoteP = 1;
            mysqlConnection.query('INSERT INTO `professionnel` (`NomPrenomPro`, `emailPro`, `encrypted_password`,`salt`, `actif`, `emailToken`, `telPro`, `dateNaissPro`, `numCinPro`, `CinPro`, `adressePro`, `nbAnneeExp`, `CartePro`, `idCategorie`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[name,email,password,salt,0,emailToken,tel,dateN,numCIN,cin,adresse,nbAnnee,cartePro,idC],function (err,result,fields) {
                mysqlConnection.on('error',function (err) {
                    console.log('[MySQL ERROR]',err);
                    res.json('register error',err);
                    // console.log(email);
                });
                res.json('enregistré avec succès');
                console.log("enregistré");
                //mail
                var mailOptions={
                    from: 'tarekbenyahia97@gmail.com',
                    to: email,
                    subject : 'Inscription à TROCA',
                    text: 'Bonjour '+name +',\n Bienvenue à TROCA. Vous êtes désormais membre chez nous http://localhost:3001/verifyEmail/'+emailToken,
                    html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
                        '\n' +
                        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">\n' +
                        '<head>\n' +
                        '    <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>\n' +
                        '    <meta content="width=device-width" name="viewport"/>\n' +
                        '    <meta content="IE=edge" http-equiv="X-UA-Compatible"/>\n' +
                        '    <title></title>\n' +
                        '    <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css"/>\n' +
                        '    <link href="https://fonts.googleapis.com/css?family=Bitter" rel="stylesheet" type="text/css"/>\n' +
                        '    <link href="https://fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css"/>\n' +
                        '    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"/>\n' +
                        '    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/>\n' +
                        '    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet" type="text/css"/>\n' +
                        '    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>\n' +
                        '    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"/>\n' +
                        '    <style type="text/css">\n' +
                        '        body {\n' +
                        '            margin: 0;\n' +
                        '            padding: 0;\n' +
                        '        }\n' +
                        '\n' +
                        '        table,\n' +
                        '        td,\n' +
                        '        tr {\n' +
                        '            vertical-align: top;\n' +
                        '            border-collapse: collapse;\n' +
                        '        }\n' +
                        '\n' +
                        '        * {\n' +
                        '            line-height: inherit;\n' +
                        '        }\n' +
                        '\n' +
                        '        a[x-apple-data-detectors=true] {\n' +
                        '            color: inherit !important;\n' +
                        '            text-decoration: none !important;\n' +
                        '        }\n' +
                        '    </style>\n' +
                        '    <style id="media-query" type="text/css">\n' +
                        '        @media (max-width: 700px) {\n' +
                        '\n' +
                        '            .block-grid,\n' +
                        '            .col {\n' +
                        '                min-width: 320px !important;\n' +
                        '                max-width: 100% !important;\n' +
                        '                display: block !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .block-grid {\n' +
                        '                width: 100% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .col {\n' +
                        '                width: 100% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .col_cont {\n' +
                        '                margin: 0 auto;\n' +
                        '            }\n' +
                        '\n' +
                        '            img.fullwidth,\n' +
                        '            img.fullwidthOnMobile {\n' +
                        '                max-width: 100% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col {\n' +
                        '                min-width: 0 !important;\n' +
                        '                display: table-cell !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack.two-up .col {\n' +
                        '                width: 50% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col.num2 {\n' +
                        '                width: 16.6% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col.num3 {\n' +
                        '                width: 25% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col.num4 {\n' +
                        '                width: 33% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col.num5 {\n' +
                        '                width: 41.6% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col.num6 {\n' +
                        '                width: 50% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col.num7 {\n' +
                        '                width: 58.3% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col.num8 {\n' +
                        '                width: 66.6% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col.num9 {\n' +
                        '                width: 75% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .no-stack .col.num10 {\n' +
                        '                width: 83.3% !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .video-block {\n' +
                        '                max-width: none !important;\n' +
                        '            }\n' +
                        '\n' +
                        '            .mobile_hide {\n' +
                        '                min-height: 0px;\n' +
                        '                max-height: 0px;\n' +
                        '                max-width: 0px;\n' +
                        '                display: none;\n' +
                        '                overflow: hidden;\n' +
                        '                font-size: 0px;\n' +
                        '            }\n' +
                        '\n' +
                        '            .desktop_hide {\n' +
                        '                display: block !important;\n' +
                        '                max-height: none !important;\n' +
                        '            }\n' +
                        '        }\n' +
                        '    </style>\n' +
                        '</head>\n' +
                        '<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #ebebeb;">\n' +
                        '<table bgcolor="#ebebeb" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ebebeb; width: 100%;" valign="top" width="100%">\n' +
                        '    <tbody>\n' +
                        '    <tr style="vertical-align: top;" valign="top">\n' +
                        '        <td style="word-break: break-word; vertical-align: top;" valign="top">\n' +
                        '            <div style="background-color:transparent;">\n' +
                        '                <div class="block-grid" style="min-width: 320px; max-width: 680px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">\n' +
                        '                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">\n' +
                        '                        <div class="col num12" style="min-width: 320px; max-width: 680px; display: table-cell; vertical-align: top; width: 680px;">\n' +
                        '                            <div class="col_cont" style="width:100% !important;">\n' +
                        '                                <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">\n' +
                        '                                    <div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">\n' +
                        '                                       <a href="http://www.example.com" style="outline:none" tabindex="-1" target="_blank"> <img align="center" alt="Bienvenue à TROCA!" border="0" class="center autowidth" src="https://www.linkpicture.com/q/entete.jpg" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 680px; display: block;" title="Bienvenue à TROCA!" width="680"/></a>\n' +
                        '                                    </div>\n' +
                        '                                </div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '            <div style="background-color:transparent;">\n' +
                        '                <div class="block-grid" style="min-width: 320px; max-width: 680px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #ffffff;">\n' +
                        '                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">\n' +
                        '                        <div class="col num12" style="min-width: 320px; max-width: 680px; display: table-cell; vertical-align: top; width: 680px;">\n' +
                        '                            <div class="col_cont" style="width:100% !important;">\n' +
                        '                                <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:15px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;">\n' +
                        '                                    <div style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.5;padding-top:10px;padding-right:25px;padding-bottom:10px;padding-left:25px;">\n' +
                        '                                        <div style="line-height: 1.5; font-size: 12px; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 18px;">\n' +
                        '                                            <p style="font-size: 16px; line-height: 1.5; word-break: break-word; text-align: center; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 16px;">Bonjour '+name+'</span></p>\n' +
                        '                                            <p style="font-size: 16px; line-height: 1.5; word-break: break-word; text-align: center; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 16px;">Merci d’avoir choisi notre application de Troc et prestataire de services!</span></p>\n' +
                        '                                            <p style="font-size: 16px; line-height: 1.5; word-break: break-word; text-align: center; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 16px;">Veuillez prendre une minute pour compléter votre inscription en confirmant votre adresse e-mail '+email+' </span></p>\n' +
                        '                                            <p style="font-size: 16px; line-height: 1.5; word-break: break-word; text-align: center; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 16px;">Veuillez cliquer sur le bouton ci-dessous!</span></p>\n' +
                        '                                        </div>\n' +
                        '                                    </div>\n' +
                        '                                    <div align="center" class="button-container" style="padding-top:35px;padding-right:10px;padding-bottom:10px;padding-left:10px;">\n' +
                        '                                        <a href="http://localhost:3001/verifyEmail/'+emailToken +'" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #ff6600; border-radius: 25px; -webkit-border-radius: 25px; -moz-border-radius: 25px; width: auto; width: auto; border-top: 0px solid #8a3b8f; border-right: 0px solid #8a3b8f; border-bottom: 0px solid #8a3b8f; border-left: 0px solid #8a3b8f; padding-top: 10px; padding-bottom: 10px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:35px;padding-right:35px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">Vérifier Votre Compte</span></span></a>\n' +
                        '                                    </div>\n' +
                        '                                </div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '            <div style="background-color:transparent;">\n' +
                        '                <div class="block-grid" style="min-width: 320px; max-width: 680px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #57687c;">\n' +
                        '                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#57687c;">\n' +
                        '                        <div class="col num12" style="min-width: 320px; max-width: 680px; display: table-cell; vertical-align: top; width: 680px;">\n' +
                        '                            <div class="col_cont" style="width:100% !important;">\n' +
                        '                                <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:20px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">\n' +
                        '                                    <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">\n' +
                        '                                       <img align="center" alt="Your Logo Gray" border="0" class="center fixedwidth" src="https://www.linkpicture.com/q/YourLogo-Gray-01.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 136px; display: block;" title="Your Logo Gray" width="136"/>\n' +
                        '                                    </div>\n' +
                        '                                    <table cellpadding="0" cellspacing="0" class="social_icons" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%">\n' +
                        '                                        <tbody>\n' +
                        '                                        <tr style="vertical-align: top;" valign="top">\n' +
                        '                                            <td style="word-break: break-word; vertical-align: top; padding-top: 15px; padding-right: 15px; padding-bottom: 15px; padding-left: 15px;" valign="top">\n' +
                        '                                                <table align="center" cellpadding="0" cellspacing="0" class="social_table" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;" valign="top">\n' +
                        '                                                    <tbody>\n' +
                        '                                                    <tr align="center" style="vertical-align: top; display: inline-block; text-align: center;" valign="top">\n' +
                        '                                                        <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 5px; padding-left: 5px;" valign="top"><a href="https://www.facebook.com/" target="_blank"><img alt="Facebook" height="32" src="https://www.linkpicture.com/q/facebook2x_4.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;" title="facebook" width="32"/></a></td>\n' +
                        '                                                        <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 5px; padding-left: 5px;" valign="top"><a href="https://www.twitter.com/" target="_blank"><img alt="Twitter" height="32" src="https://www.linkpicture.com/q/twitter2x_3.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;" title="twitter" width="32"/></a></td>\n' +
                        '                                                        <td style="word-break: break-word; vertical-align: top; padding-bottom: 0; padding-right: 5px; padding-left: 5px;" valign="top"><a href="https://www.instagram.com/" target="_blank"><img alt="Instagram" height="32" src="https://www.linkpicture.com/q/instagram2x_4.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; display: block;" title="instagram" width="32"/></a></td>\n' +
                        '                                                    </tr>\n' +
                        '                                                    </tbody>\n' +
                        '                                                </table>\n' +
                        '                                            </td>\n' +
                        '                                        </tr>\n' +
                        '                                        </tbody>\n' +
                        '                                    </table>\n' +
                        '                                    <div style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.8;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">\n' +
                        '                                        <div style="line-height: 1.8; font-size: 12px; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 22px;">\n' +
                        '                                            <p style="text-align: center; line-height: 1.8; word-break: break-word; font-size: 14px; mso-line-height-alt: 25px; margin: 0;"><span style="font-size: 14px; color: #8d99ae;">Tunis, 3014 Tunisia</span></p>\n' +
                        '                                            <p style="text-align: center; line-height: 1.8; word-break: break-word; font-size: 14px; mso-line-height-alt: 25px; margin: 0;"><span style="font-size: 14px; color: #8d99ae;">info@troca.com   |  (+216) 24 760 280</span></p>\n' +
                        '                                            <p style="text-align: center; line-height: 1.8; word-break: break-word; mso-line-height-alt: 22px; margin: 0;"> </p>\n' +
                        '                                            <p style="text-align: center; line-height: 1.8; word-break: break-word; mso-line-height-alt: 22px; margin: 0;"><br/><span style="font-size: 14px; color: #8d99ae;">2020 © All Rights Reserved</span></p>\n' +
                        '                                            <p style="text-align: center; line-height: 1.8; word-break: break-word; mso-line-height-alt: 22px; margin: 0;"> </p>\n' +
                        '                                            <p style="text-align: center; line-height: 1.8; word-break: break-word; font-size: 14px; mso-line-height-alt: 25px; margin: 0;"><span style="font-size: 14px; color: #8d99ae;"><a href="" rel="noopener" style="text-decoration: underline; color: #8d99ae;" target="_blank">Unsubscribe</a> | <a href="" rel="noopener" style="text-decoration: underline; color: #8d99ae;" target="_blank">Visiter le site Web</a></span></p>\n' +
                        '                                        </div>\n' +
                        '                                    </div>\n' +
                        '                                </div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '        </td>\n' +
                        '    </tr>\n' +
                        '    </tbody>\n' +
                        '</table>\n' +
                        '</body>\n' +
                        '</html>'

                };
                transporter.sendMail(mailOptions,function (error,info) {
                    if (error){console.log(error)}
                    else console.log('email envoyé ');
                });
            });
        }
    });
    var actif=true;
    var mailTok=null;


});

app.post('/login/',(req,res,next)=> {
    var post_data = req.body;
    //extraire le mdp et l'email
    var user_password = post_data.password;
    var email = post_data.email;

    mysqlConnection.query('select * from professionnel where emailPro=?', [email], function (error, result, fields) {
        mysqlConnection.on('error', function (err) {
            console.log('[MySQL ERROR]', err);
            res.json('register error', err);
            // console.log(email);
        });
        if (result && result.length) {
            var salt = result[0].salt; //get salt of a result if it exisits
            var encrypted_password = result[0].encrypted_password;
            var hashed_password = checkHashPassword(user_password, salt).passwordHash;
            var active =result[0].actif;
            if (encrypted_password==hashed_password && active) {
                res.end(JSON.stringify(result[0])) //si mdp correct retournzeer les donnees du user
            }
            else if (active){
                res.end(JSON.stringify('Compte Non Actif'));
            }
            else {
                res.end(JSON.stringify('Mot De Passe errone'));
                console.log('Mot de passe errone');
            }
        }
        else {
            res.json('Utilisateur non existant')
        }
    });
})
var actif=true;
app.post('/verifyEmail/:emailToken',(request,response)=>{
    mysqlConnection.query('UPDATE `professionnel` SET `actif`=?,`emailToken`=?  WHERE `emailToken`=?',[actif,null,request.params.emailToken],function (err,rows,fields){
        if (err)console.log(err);
        else console.log('done');
        // res.redirect('/login/');
    })
});
app.post('/ForgotPass/',(request,response)=>{
    var post_data = request.body;
    var mailC=post_data.email;
    var token=crypto.randomBytes(64).toString('hex');
    console.log(token);
    mysqlConnection.query('select * from professionnel where emailPro=?', [mailC], function (error, result, fields) {

        if (result && result.length) {
            console.log('mail existant');
            mysqlConnection.query('UPDATE `professionnel` SET `actif`=?,`encrypted_password`=?  WHERE `emailPro`=?',[false,token,mailC],function (err,rows,fields){
                if (err)console.log(err);
                else console.log('done');
                // res.redirect('/login/');
            })

        }
        var mailOptions={
            from: 'tarekbenyahia97@gmail.com',
            to: mailC,
            subject : 'Mot de Passe TROCA oublié',
            text: 'Bonjour ,\n Cliquez sur le lien suivant pour modifier votre mot de passe http://localhost:3001/changePassword/'+token+''
        };
        transporter.sendMail(mailOptions,function (error,info) {
            if (error){console.log(error)}
            else console.log('email envoyé ');

        });
    })
});

app.post('/changePassword/:pswd',(req,res,next)=>{
    var post_data=req.body;//get post params
    var uid= uuid.v4();
    var plaint_password=post_data.password; // get password from post params
    var hash_data=saltHashPassword(plaint_password);
    var password= hash_data.passwordHash; //get hash value
    var salt =hash_data.salt; //get salt
    var actif=true;
    console.log(req.params.pswd);

    mysqlConnection.query('UPDATE `professionnel` SET `encrypted_password`=?,`salt`=?,`actif`=?  WHERE `encrypted_password`=?',[password,salt,actif,req.params.pswd],function (err,result,fields) {
        mysqlConnection.on('error',function (err) {
            console.log('[MySQL ERROR]',err);
            res.json('Password change error',err);
            // console.log(email);
        });
        res.json('Mot de passe modifié avec succès');

    });
});
app.post('/NoterCl/',(req,res,next)=> {
    var post_data = req.body;
    var note = parseInt(post_data.note,10);
    var email = post_data.email;

    mysqlConnection.query('select * from professionnel where emailPor=?', [email], function (error, result, fields) {
        var nbr = result[0].nbNote + 1;
        var noteGlobale = parseFloat(((result[0].note*result[0].nbNote) + note)/ nbr) ;
        if (error){console.log(error)}
        else {

            noteGl=noteGlobale.toFixed(2);
            mysqlConnection.query('UPDATE `professionnel` SET `note`=?,`nbNote`=?  WHERE `emailPor`=?', [noteGl, nbr, email], function (err, result, fields) {
                res.json('Note attribuée');
                console.log('note attribuée');

            })
        }
    });
})
