const users = require('../data/usersDataBase.json')
const { check,body } = require('express-validator')

module.exports = [
    check('name')
        .isLength({ min: 2 }).withMessage('Minimo 2 caracteres').bail()
        .isAlpha().withMessage('solo letras porfa'),

    check('surname')
        .isLength({ min: 2 }).withMessage('Minimo 2 caracteres').bail()
        .isAlpha().withMessage('solo letras porfa'),

    body('email')
        .notEmpty().withMessage('Debes proporcionar un email').bail()
        .isEmail().withMessage('Debe ser un email valido')
        .custom((value,{req}) => {
            const user = users.find(user => user.email === value)
            if(user) {
               return false 
            }else{
                return true
            }
            
        }).withMessage('El email ya se encuentra registrado!'),
        

    check('pass')
        .isLength({ min: 6, max: 12 }).withMessage('La contraseña debe tener un minimo de 6 y un maximo de 12').bail(),

    body('pass2')
        .custom((value , {req}) => {
            if (value !== req.body.pass) {
                return false
            }else{
                return true
            }
        }).withMessage('La contraseña no coinside'),

    check('bases')
        .isString('on').withMessage('Debes aceptar las bases y condiciones')
]