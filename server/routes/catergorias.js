const express = require('express')
let { verificaToken, VerificaAdmin_Role } = require('../middleware/autenticacion')
const bodyParser = require('body-parser')


let app = express()

let Categoria = require('../models/categoria');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

//========================
//Mostrar las categorias
//========================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('Usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            })
        })
})

//========================
//Las categorias por id
//========================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                message: 'No existe una categoria asociada a este usuario'
            });
        }
        res.json({
            ok: true,
            categoria
        })
    })


})

//========================
//Crea una categoria
//========================

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id //es un REQ.USUARIO.ID NO BODY."..."
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(400).json({
            ok: true,
            categoria: categoriaDB
        });
    })
})

app.put('/categoria/:id', verificaToken, (req, res) => {


    let id = req.params.id;
    let body = req.body;

    let newCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, newCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            Categoria: categoriaDB
        })
    })

})

app.delete('/categoria/:id', [verificaToken, VerificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: 'La categoria a sido borrada'
        })
    })

})

module.exports = app;