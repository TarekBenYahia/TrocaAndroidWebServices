function connexion() {
    const mysql=require('mysql');
    const express=require('express');
    var app=express();


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

}
module.exports={
    connexion
};

