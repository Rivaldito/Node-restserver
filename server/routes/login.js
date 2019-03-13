const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())



app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, resp) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!resp) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El (usuario) o contraseña son invalidos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, resp.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario o (contraseña) son invalidos'
                }
            })
        }

        let token = jwt.sign({
            usuario: resp
        }, process.env.SEED, { expiresIn: process.env.TIME_TOKEN });

        res.json({
            ok: true,
            usuario: resp,
            token
        })
    })

})

module.exports = app;