const express = require('express');
const appConfig = require('./config/config');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const globalErrorMiddle = require('./middlewares/appErrorHandler')
const routeLoggerMiddleWare = require('./middlewares/routeLogger')


const app = express();

const fs = require('fs');

let routesPath = './routes';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.use(globalErrorMiddle.globalErrorHandler)
app.use(routeLoggerMiddleWare.logIp)

fs.readdirSync(routesPath).forEach(function(file){
    if(~file.indexOf('.js')){
        let route=require(routesPath+'/'+file);
        route.setRouter(app);
    }
})

let modelsPath = './models'

fs.readdirSync(modelsPath).forEach(function (file){

    if(~file.indexOf('.js')) require(modelsPath+'/'+file)

})


app.listen(appConfig.port, ()=> {
    console.log('example app listening on port 3000!')
    let db = mongoose.connect(appConfig.db.uri, { useMongoClient: true });
});

mongoose.connection.on('error', function(err){
    console.log('database connection error');
    console.log(err)
});

mongoose.connection.on('open', function(err){
    if(err){
        console.log('database error');
        console.log('error');
    }

    console.log("database connection open success");
});