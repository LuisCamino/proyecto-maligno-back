const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../../api/users/user.model");
const { validateEmail, validatePassword } = require("../helpers/validations");

const loginStrategy = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, username, password, done) => {
    const isValidPassword = validatePassword(password);
    console.log(isValidPassword);
    if (!isValidPassword) {
      const error = new Error(
        "Datos incorrectos. Revisa los requisitos de email y constraseña"
      );
      error.status = 400;
      return done(error);
    }

    const user = await User.findOne({ username: username });
    console.log(user);
    if (!user) {
      const error = new Error("No existe el usuario, regístrate primero");
      error.status = 401;
      return done(error);
    }

    if (password !== user.password) {
      const error = new Error("Constraseña incorrecta");
      error.status = 401;
      return done(error);
    }

    user.password = null;
    return done(null, user);
  }
);

module.exports = loginStrategy;
