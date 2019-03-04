const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: 'el rol {VALUE} no es admitido'
};

let UsuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre de usuario es requerido']
    },

    email: {
        type: String,
        required: [true, 'El correo electronico es requerido'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    img: {
        type: String,
        required: false
    },

    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },

    google: {
        type: Boolean,
        default: false
    },

    status: {
        type: Boolean,
        default: true

    }

});

UsuarioSchema.methods.toJSON = function() {

    let user = this
    userObject = user.toObject();
    delete userObject.password

    return userObject
}

UsuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser unico' });

module.exports = mongoose.model('usuario', UsuarioSchema);