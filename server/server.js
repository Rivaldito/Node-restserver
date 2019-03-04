require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuarios'));

//leer la documentacion de mongoose {useNewUrlParser: true}
//Era la unica forma de conectar a la base de datos, sin que apareciera el erro "parser"
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, resp) => {

    if (err) {
        throw err;
    } else {
        console.log('La base de datos esta conectada');
    }

});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el Puerto ${process.env.PORT}`);
})