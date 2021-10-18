const Nexmo = require('nexmo');
const express = require('express')
const router = express.Router()


router.get('/sms/',(req,res,next)=>{

    const nexmo = new Nexmo({
        apiKey: '7f104be5',
        apiSecret: 'ngMSEGkLbvt45Se8',
    });
    const from = 'TROCA';
    const to = '21624760280';
    const text = 'Votre Paiement a bien été éffectué! Merci de votre fidélite';
    nexmo.message.sendSms(from, to, text);



});

module.exports = router;