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
    urlDB = 'mongodb+srv://sebastian:123456-@cluster0-c96s8.mongodb.net/test?retryWrites=true'
}

process.env.URLDB = urlDB;