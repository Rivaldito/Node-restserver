const express = require('express');
const Producto = require('../models/producto')
let { verificaToken, VerificaAdmin_Role } = require('../middleware/autenticacion')
const bodyParser = require('body-parser')
const _ = require('underscore');
let app = express()
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())




//========================================================
//El modelo de las instancias es similar al de categorias
//========================================================

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('Usuario', 'nombre email')
        .populate('Categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productoDB,
                    conteo
                })
            })
        })

})

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un producto asociada al id'
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

app.post('/producto', [verificaToken, VerificaAdmin_Role], (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('Categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })
})

app.put('/producto/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'categoria', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'No existe el producto'
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

app.delete('/producto/:id', [verificaToken, VerificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'No existe el producto'
            });
        }
        productoDB.disponible = false;

        productoDB.save((err, productoguardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoguardado
            })

        })
    })
})




module.exports = app