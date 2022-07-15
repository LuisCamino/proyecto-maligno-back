const express = require('express');
const { getAllUsers, getUser, deleteUser, postRegister, postLogin, postLogout, putUser } = require('./user.controller');
const {isAuthenticated} = require('../../utils/middlewares/auth.middlewares');

const UsersRoutes = express.Router();

UsersRoutes
    .get('/', getAllUsers)
    .get('/:id', getUser)
    .delete('/:id', deleteUser)
    .put('/:id', putUser)
    .post('/register', postRegister)
    .post('/login', postLogin)
    .post('/logout', [isAuthenticated], postLogout);


module.exports = UsersRoutes;