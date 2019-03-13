const express = require('express')
const app = express()
const Usuario = require('../models/usuarios')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const v = require('../middleware/autenticacion')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


app.get('/usuario', v.verificaToken, function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'nombre email role img status')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })


        });

});

app.post('/usuario', [v.verificaToken, v.VerificaAdmin_Role], (req, res) => {

    let body = req.body;


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.status(400).json({
            ok: true,
            usuario: usuarioDB
        });

    });

    /* Prueba del funcionamiento del post

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: 'False',
            error: 'El nombre es requerido'
        })

    } else {
        res.json({
            persona: body
        })
    }
    */

});

app.delete('/usuario/:id', [v.verificaToken, v.VerificaAdmin_Role], function(req, res) {


    let id = req.params.id;

    let estado = {
        status: false
    }

    Usuario.findByIdAndUpdate(id, estado, { new: true }, (err, usuarioStatus) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioStatus) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El ususario no existe"
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioStatus
        })

    })

    /* Borrar usuarios, Es preferible cambiar el estatus a false

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El ususario no existe"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado

        })
    })
*/
});

app.put('/usuario/:id', [v.verificaToken, v.VerificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['email', 'role', 'nombre', 'img']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })


});

module.exports = app;