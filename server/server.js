require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const mongo = require('./config/mongo')
const path = require('path')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '../public')))



app.use(require('./routes/index'));

mongo.Conectar();


app.listen(process.env.PORT, () => {
    console.log(`Escuchando el Puerto ${process.env.PORT}`);
})