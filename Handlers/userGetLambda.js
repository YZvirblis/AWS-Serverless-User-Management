const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const secretsManager = new AWS.SecretsManager();
const dynamodb = new AWS.DynamoDB.DocumentClient();

let jwtSecretKey;

exports.handler = async (event) => {
  const headers = event.headers;
  const token = headers.Authorization;

  try {
    if (!jwtSecretKey) {
      const data = await secretsManager
        .getSecretValue({ SecretId: "JWT_SECRET_KEY" })
        .promise();
      jwtSecretKey = JSON.parse(data.SecretString)["JWT_SECRET_KEY"];
    }

    const decodedToken = jwt.verify(token, jwtSecretKey);

    const { sub: userId } = decodedToken;

    // Retrieve user data from DynamoDB
    const getUserParams = {
      TableName: "ExamUserTable",
      Key: {
        UserId: userId, // Use the extracted UserId for fetching user data
      },
    };

    const user = await dynamodb.get(getUserParams).promise();

    if (!user.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ user: user.Item }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }
};
