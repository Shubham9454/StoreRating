const validator = require("validator");

// Validation functions
const validateName = (name) => {
  return name && name.length >= 20 && name.length <= 60;
};

const validateAddress = (address) => {
  return address && address.length <= 400;
};

const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
  return regex.test(password);
};

const validateEmail = (email) => {
  return validator.isEmail(email);
};

module.exports = {validateName , validateAddress , validatePassword , validateEmail};