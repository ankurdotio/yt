host: http://localhost:3000

# Login API

api: /api/auth/login

request_body:
{
  "username": "sarangkale66",
  "password": "Test@123"
}

response_body:
{
    "success": true,
    "message": "Login successful",
    "data": {
        "username": "sarangkale66",
        "email": "sarang66@gmail.com"
    }
}

# Register API

api: /api/auth/signup

request_body:
{
  "email": "sarang66@gmail.com",
  "password": "Test@123",
  "username":"sarangkale66"
}

response_body:
{
  success: true,
  message: "User created successfully",
  data: {
    username: "sarangkale66",
    email: "sarang66@gmail.com",
  },
}