const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../../api/users/user.model");
const { validateEmail, validatePassword } = require("../helpers/validations");

const saltRounds = 10;

const registerStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        const error = new Error(
          "Los datos introducidos, email o contraseña, no son correctos"
        );
        error.status = 400;
        return done(error, null);
      }

      const validEmail = validateEmail(email);
      if (!validEmail) {
        const error = new Error(
          "Los datos introducidos, email o contraseña, no son correctos"
        );
        error.status = 400;
        return done(error, null);
      }

      const validPassword = validatePassword(password);
      if (!validPassword) {
        const error = new Error(
          "Los datos introducidos, email o contraseña, no son correctos"
        );
        error.status = 400;
        return done(error, null);
      }

      const userDB = await user.save();
      userDB.password = "Game Over";
      return done(null, userDB);
    } catch (error) {
      return done(error, null);
    }
  }
);

module.exports = registerStrategy;
