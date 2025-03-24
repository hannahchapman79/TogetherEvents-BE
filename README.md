# TogetherEvents Backend

Hosted version: https://togetherevents-be.onrender.com

## Table of Contents
- [Description](#description)
- [Getting Started](#getting-started)
  - [Dependencies](#dependencies)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Setting Up the Database](#setting-up-the-database)
  - [Running Test Suite](#running-test-suite)
  - [Test Account Credentials](#test-account-credentials)

## Description

TogetherEvents Backend is a Node.js and Express.js backend API that powers a community events website. Features include MongoDB-based event management, JWT-based user authentication, and role-based authorisation (admin/user). The platform allows users to view and sign up for events, while admins can create and manage events.

## Getting Started

### Dependencies

**Development Dependencies**
- Jest: ^27.5.1  
- Supertest: ^6.3.4  
- MongoDB Memory Server: ^10.1.3  

**Dependencies**
- Dotenv: ^16.3.1  
- Nodemon: ^3.1.9  
- Cookie Parser: ^1.4.7  
- Bcrypt: ^5.1.1  
- Express: ^4.18.2  
- Cors: ^2.8.5  
- JSON Web Token: ^9.0.2  
- MongoDB: ^6.12.0  
- Mongoose: ^8.9.3  

**Requirements**
- Node.js: v21.1.0  

### Installation

1. Clone the repository  
2. Run `npm install`  

### Environment Variables

3. Create Environment Files: Create two .env files: .env.test and .env.development.
4. Each file should contain the appropriate MongoDB database URI for that environment and two JWT secrets for access and refresh tokens.

#### Example `.env.development` file:
```ini
MONGO_URI=mongodb+srv://your_database_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Setting Up the Database

5. Install dependencies outlined above
6. Run the command "npm start"

### Running Test Suite

7. Run "npm run test"
