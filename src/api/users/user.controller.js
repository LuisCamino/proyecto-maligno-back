const User = require("./user.model");
const passport = require("passport"); 

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("username");
    if (!user) {
      const error = new Error("No user found by this id");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDB = await User.findByIdAndDelete(id);
    if (!userDB) {
      const error = new Error("No user found by this id");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json(userDB);
  } catch (error) {
    return next(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const putUser = new User(req.body);
    putUser._id = id;
    const userDB = await User.findByIdAndUpdate(id, putUser);
    if (!userDB) {
      const error = new Error("No user found");
      error.status = 400;
      return next(error);
    }

    return res.status(200).json(userDB);
  } catch (error) {
    return next(error);
  }
};

const postRegister = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    const error = new Error("Email or password is missing");
    error.status = 400;
    return next(error);
  }

  const done = (error, user) => {
    if (error) {
      return next(error);
    }

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }

      return res.status(201).json(user);
    });
  };

  passport.authenticate("registro", done)(req);
};

const postLogin = (req, res, next) => {
  console.log(req.body);
  const done = (error, user) => {
    if (error) {
      return next(error);
    }

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.status(200).json(user);
    });
  };
  passport.authenticate("login", done)(req);
};

const postLogout = async (req, res, next) => {
  if (req.user) {
    await req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.status(200).json("Goodbye!");
      });
    });
  } else {
    return res.sendStatus(304);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
  postRegister,
  postLogin,
  postLogout,
  putUser,
}; 
