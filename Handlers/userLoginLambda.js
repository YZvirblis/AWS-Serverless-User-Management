const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();
const jwt = require("jsonwebtoken");
const secretsManager = new AWS.SecretsManager();

let jwtSecretKey;

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { username, password } = body;

  // Get JWT secret from AWS Secret Manager and cache it for better performance
  try {
    if (!jwtSecretKey) {
      const data = await secretsManager
        .getSecretValue({ SecretId: "JWT_SECRET_KEY" })
        .promise();
      jwtSecretKey = JSON.parse(data.SecretString)["JWT_SECRET_KEY"];
    }

    // Authenticate user against Cognito User Pool
    const authParams = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "6k7tmrrstcaifop99n90lui5h9",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    await cognito.initiateAuth(authParams).promise();

    // Retrieve additional user attributes, including UserId
    const userParams = {
      UserPoolId: "eu-west-1_H8ZwR0jwv",
      Username: username,
    };
    const userAttributes = await cognito.adminGetUser(userParams).promise();
    const userId = userAttributes.UserAttributes.find(
      (attr) => attr.Name === "custom:ID"
    ).Value;

    // Return the JWT token if authentication is successful
    const userClaims = {
      sub: userId,
      username: username,
    };

    const token = jwt.sign(userClaims, jwtSecretKey, { expiresIn: "4h" });

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    console.error("Error:", error);

    if (error.code === "NotAuthorizedException") {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Incorrect username or password" }),
      };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Authentication failed" }),
    };
  }
};
