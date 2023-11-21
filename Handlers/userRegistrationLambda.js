const AWS = require("aws-sdk");
const { CognitoIdentityServiceProvider } = AWS;
const dynamodb = new AWS.DynamoDB.DocumentClient();
const registrationValidation = require("../validator");

exports.handler = async (event) => {
  const userData = JSON.parse(event.body);
  const { firstName, lastName, phoneNumber, password, id } = userData;

  // clear hyphens from phone number (if there are any).
  const cleanedPhoneNumber = phoneNumber.replace(/-/g, "");

  // Validate all request data
  const validationResult = registrationValidation(
    firstName,
    lastName,
    cleanedPhoneNumber,
    password,
    id
  );

  // In case of failure return with a corresponding error message.
  if (validationResult && validationResult.statusCode === 400) {
    return validationResult;
  }

  const cognito = new CognitoIdentityServiceProvider();
  try {
    // Register user with Cognito User Pool
    const registrationParams = {
      ClientId: "6k7tmrrstcaifop99n90lui5h9",
      Username: cleanedPhoneNumber, // Use phone number as the username
      Password: password,
      UserAttributes: [
        { Name: "given_name", Value: firstName },
        { Name: "family_name", Value: lastName },
        { Name: "phone_number", Value: cleanedPhoneNumber },
        { Name: "custom:ID", Value: id },
      ],
    };
    await cognito.signUp(registrationParams).promise();

    // Store user data in DynamoDB
    const dbParams = {
      TableName: "ExamUserTable",
      Item: {
        UserId: id, // 'UserId' is the primary key in DynamoDB
        firstName: firstName,
        lastName: lastName,
        phoneNumber: cleanedPhoneNumber,
      },
    };
    await dynamodb.put(dbParams).promise();

    // After successful registration, automatically confirm the user
    // (I removed MFA in order to simplify testing for this exam)
    await cognito
      .adminConfirmSignUp({
        UserPoolId: "eu-west-1_H8ZwR0jwv",
        Username: cleanedPhoneNumber,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User registered successfully",
        UserId: id,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Failed to register user - ${error}` }),
    };
  }
};
