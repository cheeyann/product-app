## Solution

#1 Security implementation <br/>
Implemented admin access for POST, PUT and DELETE API. <br/>
JWT Authentication: Implemented using the JwtStrategy in the AuthModule. <br/>
Role-Based Access Control: Managed via RolesGuard and @Roles() decorator. <br/>

#2 JWT generator developed in the AuthModule to generate JWT token and pass into the product API Authorization header. <br/>
`http://localhost:3000/auth/login` <br/>
`payload`: { <br/>
"username": "admin", <br/>
"roles": ["admin"] <br/>
} <br/>

`response`: { <br/>
"access_token": "string" <br/>
} <br/>

#3 Swagger Documentation <br/>
npm run start <br/>
Access the documentation at: `http://localhost:3000/api` <br/>

#3 Unit tests with 82.65% code coverage. <br/>
