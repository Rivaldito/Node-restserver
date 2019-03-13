const mongoose = require('mongoose');
require('./config')


//leer la documentacion de mongoose {useNewUrlParser: true}
//Era la unica forma de conectar a la base de datos, sin que apareciera el erro "parser"
let Conectar = () => {
    mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, resp) => {

        if (err) {
            throw err;
        } else {
            console.log('La base de datos esta conectada');
        }

    });
}


module.exports = {
    Conectar
}