const {
  isValidIsraeliID,
  isValidName,
  isValidPhoneNumber,
  isValidPassword,
} = require("./tools");

function registrationValidation(
  firstName,
  lastName,
  phoneNumber,
  password,
  id
) {
  // Validate user data
  if (!firstName || !lastName || !phoneNumber || !password || !id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid user data. All fields are required.",
      }),
    };
  }

  // Validate Israeli ID
  if (!isValidIsraeliID(id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid Israeli ID.",
      }),
    };
  }

  // Validate First Name
  if (!isValidName(firstName)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid Name.",
      }),
    };
  }
  // Validate Last Name
  if (!isValidName(lastName)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid Name.",
      }),
    };
  }
  // Validate Phone Number
  if (!isValidPhoneNumber(phoneNumber)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid Phone Number.",
      }),
    };
  }
  // Validate Password
  if (!isValidPassword(password)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid Password.",
      }),
    };
  }

  return;
}

module.exports = registrationValidation;
