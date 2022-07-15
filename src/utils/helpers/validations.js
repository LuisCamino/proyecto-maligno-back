const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(String(password).toLowerCase());
};

module.exports = {
  validatePassword,
};
