SocialPostAPI

SocialPostAPI is a RESTful API for creating, updating, and deleting posts, comments, and users. It provides an authentication system based on JWT tokens and a cache mechanism using Redis. The API is built using Node.js, Express.js, and MongoDB as the database. The API also utilizes Postman for testing and validation of endpoints.

Introduction

This is the readme file for the SocialPostAPI project. In this file, you will find information about how to use the API and its endpoints, as well as other relevant details about the project.

Getting Started

To use the SocialPostAPI, follow the instructions below.

Clone the repository or download the zip file and extract it to your preferred location.
Navigate to the project directory in your terminal.
Run npm install to install all the required dependencies.
Create a .env file at the root of the project and add your MongoDB connection string and JWT secret key. An example .env file is included in the project.
Run npm start to start the server.
Use Postman to test and validate the endpoints.
API Endpoints
The SocialPostAPI provides the following endpoints:

/posts

GET: Retrieve all posts. Only available for authenticated users.

POST: Create a new post. Only available for authenticated users.

PUT: Update a post. Only available for the creator of the post.

DELETE: Delete a post. Only available for the creator of the post.

/users

GET: Retrieve all users.

POST: Create a new user.

PUT: Update a user.

DELETE: Delete a user.

Authentication

The SocialPostAPI uses JWT tokens for authentication. When a user logs in, a token is generated and sent in the response. This token must be included in the headers of all subsequent requests to authenticated endpoints.

Cache

The SocialPostAPI uses Redis for caching. The refresh tokens are stored in the Redis cache memory.

Technology Stack

The SocialPostAPI is built using the following technologies:
Node.js
Express.js
MongoDB
Postman
Redis

Contributing

Contributions to the SocialPostAPI are always welcome. If you find any bugs or have suggestions for improvement, feel free to open an issue or create a pull request.


Links
GitHub Link: https://github.com/Aniketpawar0351/SocialPostAPI

Real-time Deployment Link: https://socialpostapi.onrender.com/users

Postman Collection Link: https://red-rocket-907331.postman.co/workspace/New-Team-Workspace~c744c475-0e50-44a1-b1f6-1c35299ff645/collection/19938484-a2329d66-51d6-4807-9e04-4d35245f2151?action=share&creator=19938484

Please note that for authentication purposes, you will need to register as a user and log in to obtain a token that you have to manually paste in the subsequent requests.
