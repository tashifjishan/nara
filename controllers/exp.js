const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

// const signedToken = jwt.sign({ id: "id of the user" }, "some secret key", {
//     expiresIn: Date.now() + 90 * 24 * 60 * 60 * 1000
// });

// console.log(signedToken)

const token = "eyJhbGciOiJdddfdfdfgdfIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImlkIG9mIHRoZSB1c2VyIiwiaWF0IjoxNzMzMjIzNjI0LCJleHAiOjE3NDI3MzI4NDc5ODJ9.Kv6cNBCTu3T7sOM0NUmd4_u9oXIiCLTCyth-UYvp3pM";


jwt.verify(token, "some secret key", (err, decoded)=>{
    if(err)
    console.log(err)
    else
    console.log(decoded)
})

// login 
// jwt token is generated
//add an item to his/her cart---- jwt token 
// jwt token is verified
//  user id is extracted
// 