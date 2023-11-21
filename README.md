# Project Documentation: AWS Serverless User Management

## Overview

This project demonstrates a serverless user management system using AWS services, including Amazon Cognito for user authentication, AWS Lambda for serverless functions, AWS DynamoDB for data storage, and JSON Web Tokens (JWTs) for secure authorization. The project fulfills the following requirements:

1. User Registration: Users can register using their first name, last name, phone number, password, and an Israeli ID.

2. User Login: Registered users can log in using their credentials, and a JWT is issued upon successful authentication.

3. Authorized Requests: Authorized requests are protected using JWTs in the request headers, ensuring that only authenticated users can access certain endpoints.

4. User Profile Updates: Users can update their profiles by sending a request with updated data, and only the new incoming data is updated while the rest remains unchanged.

## Technologies Used

- AWS Cognito User Pool: Manages user registration, authentication, and user data storage.

- AWS Lambda: Handles user registration, login, and authorized requests.

- AWS DynamoDB: Stores user data.

- JSON Web Tokens (JWTs): Used for secure authorization of requests.

- AWS Serverless Framework: Simplifies deployment and management of serverless functions.

- Postman: Provides a collection for testing the API.

## Endpoints

### User Registration

- **Endpoint:** POST /user
- **Description:** Registers a new user with the provided information.
- **Request Body:** JSON containing first name, last name, phone number, password, and ID.
- **Response:** 201 Created if successful, with the user's ID.

### User Login

- **Endpoint:** POST /user/login
- **Description:** Logs in a user and returns a JWT for authorization.
- **Request Body:** JSON containing username (phone number) and password.
- **Response:** 200 OK with a JWT if authentication is successful.

### Update User Profile

- **Endpoint:** PUT /user
- **Description:** Updates the user's profile with new data.
- **Authorization:** JWT in the request headers.
- **Request Body:** JSON containing fields to update.
- **Response:** 200 OK if successful.

### Get User Profile

- **Endpoint:** GET /user/id
- **Description:** Retrieves the user's profile data.
- **Authorization:** JWT in the request headers.
- **Response:** 200 OK with user profile data.

## Postman Collection

The Postman collection provided in this repository includes preconfigured requests for testing each API endpoint. Import the collection into Postman to easily test the functionality of the user management system.

## Conclusion

This project demonstrates the implementation of a serverless user management system using AWS services and JWTs for secure authorization. It provides a foundation for building scalable and secure user authentication and management systems in AWS Lambda and Cognito.

Please feel free to reach out if you have any questions or need further assistance with the project.

Thank you for considering my submission.

---

*Author: Yuriy Zhvirblis*
