const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

//configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }


}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken

    let googleUser = await verify(token)
        .catch(err => {
            res.status(403).json({
                ok: false,
                err
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe usar su usuario previamente creado'
                    }
                })

            } else {
                let token = jwt.sign({
                    usuario: resp
                }, process.env.SEED, { expiresIn: process.env.TIME_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token

                })

            }
        } else {

            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                google: true,
                img: googleUser.picture,
                password: '>:v'
            });



            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                } else {
                    let token = jwt.sign({
                        usuario: resp
                    }, process.env.SEED, { expiresIn: process.env.TIME_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token

                    })
                }

            })
        }
    })
})

module.exports = app;