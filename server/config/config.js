//===========================
//Configuracion del puerto
//===========================

process.env.PORT = process.env.PORT || 3000;

//  "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"
// "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="c:\data\db"

//===========================
//Entorno
//===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//===========================
//Base de datos
//===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

//===========================
//heroku congig/set
//===========================

process.env.URLDB = urlDB;

//===========================
//Semilla
//===========================

process.env.SEED = process.env.SEED || 'la-semilla'

//===========================
//time-token
//===========================

process.env.TIME_TOKEN = '48h';


//===========================
//Google Client ID
//===========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '220316675192-08tusfo6ldpj35cl8eu2osq9ckputsst.apps.googleusercontent.com'