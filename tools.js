//////////////////////////////// NAME VALIDATION
function isValidName(name) {
  // Check if the name is a non-empty string
  if (typeof name !== "string" || name.trim() === "") {
    return false;
  }
  // Check if the name consists of letters and has a maximum length of 20 characters
  if (!/^[A-Za-z]{1,20}$/.test(name)) {
    return false;
  }

  return true;
}

//////////////////////////////// ID VALIDATION
function isValidIsraeliID(id) {
  // Check if the ID is a 9-digit numeric value
  if (!/^\d{9}$/.test(id)) {
    return false;
  }

  // Convert the ID to an array of digits for further validation
  const idDigits = id.split("").map(Number);

  // Calculate the check digit
  const checkDigit = idDigits.pop();
  const sum = idDigits.reduce((acc, digit, index) => {
    const multiplier = index % 2 === 0 ? 1 : 2;
    const product = digit * multiplier;
    return acc + (product > 9 ? product - 9 : product);
  }, 0);

  // Check if the calculated check digit matches the last digit of the ID
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  return checkDigit === calculatedCheckDigit;
}

//////////////////////////////// PHONE NUMBER VALIDATION
function isValidPhoneNumber(phoneNumber) {
  const phonePattern = /^\+[0-9]{1,15}$/; // Assumes a "+" followed by 1 to 15 digits
  return phonePattern.test(phoneNumber);
}

//////////////////////////////// PASSWORD VALIDATION
function isValidPassword(password) {
  if (password.length < 6) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  }
  return true;
}

module.exports = {
  isValidIsraeliID,
  isValidName,
  isValidPhoneNumber,
  isValidPassword,
};
