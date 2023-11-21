const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const secretsManager = new AWS.SecretsManager();
const dynamodb = new AWS.DynamoDB.DocumentClient();

let jwtSecretKey;

exports.handler = async (event) => {
  const headers = event.headers;
  const token = headers.Authorization;

  try {
    // Get JWT secret from AWS Secret Manager and cache it for better performance
    if (!jwtSecretKey) {
      const data = await secretsManager
        .getSecretValue({ SecretId: "JWT_SECRET_KEY" })
        .promise();
      jwtSecretKey = JSON.parse(data.SecretString)["JWT_SECRET_KEY"];
    }

    // Extract UserId from JWT
    const decodedToken = jwt.verify(token, jwtSecretKey);
    const { sub: userId } = decodedToken;

    // Get user from DDB
    const getUserParams = {
      TableName: "ExamUserTable",
      Key: {
        UserId: userId,
      },
    };
    const user = await dynamodb.get(getUserParams).promise();
    if (!user.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    // Parse incoming request body
    const requestBody = JSON.parse(event.body);

    // Create an update expression and attribute values for DynamoDB update
    // I made it this way to be able to update fields without having to include the others that we do not want to update.
    const updateExpressionParts = [];
    const expressionAttributeValues = {};

    for (const key in requestBody) {
      if (requestBody.hasOwnProperty(key)) {
        updateExpressionParts.push(`#${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = requestBody[key];
      }
    }

    const updateExpression = `SET ${updateExpressionParts.join(", ")}`;
    const expressionAttributeNames = {};

    for (const key in requestBody) {
      if (requestBody.hasOwnProperty(key)) {
        expressionAttributeNames[`#${key}`] = key;
      }
    }

    // Update user data in DynamoDB
    const updateParams = {
      TableName: "ExamUserTable",
      Key: {
        UserId: userId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: "ALL_NEW",
    };
    const updatedUser = await dynamodb.update(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User data updated successfully",
        user: updatedUser.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }
};
