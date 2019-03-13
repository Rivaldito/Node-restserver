const jwt = require('jsonwebtoken');


//===========================
//  Verifica Token
//===========================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decode.usuario

        next();

    });

}

let VerificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next()
    } else {
        res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no posee un rol de administrador'
            }
        })
    }

}

module.exports = {
    verificaToken,
    VerificaAdmin_Role
}