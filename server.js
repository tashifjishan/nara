const express = require("express");
const mongoose = require("mongoose");
const User = require("./Models/User");
const cookieParser = require("cookie-parser")
const sizeOf = require("image-size")
const path = require("path")
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
// Routes
const userRoutes = require("./routes/user")
const productRouter = require("./routes/Product")
const cartRouter = require("./routes/cart")
const paymentRouter = require("./routes/payment")
const errorController = require("./controllers/error")

const app = express();
app.use(cookieParser())
app.use(express.json())
const corsOptions = {
  origin: 'https://coruscating-lebkuchen-4f050c.netlify.app',
  credentials: true,
};


app.use(cors(corsOptions));
app.use(mongoSanitize())

app.use("/images", express.static(path.join(__dirname, "images")))

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to the database successfully!"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Welcome to Nara! Redeployed!",
  });
});



app.use("/user", userRoutes);
app.use("/product", productRouter)
app.use("/cart", cartRouter)
app.use("/order", paymentRouter)
app.use(errorController)


const { promisify } = require("util");
const jwt = require("jsonwebtoken")
const SendMail = require("./utils/Email")
app.post("/contact", (req, res)=>{
  
  SendMail("divyabharti15012003@gmail.com", "Contact Form", req.body.message+"by: "+req.body.email, req, res)
  
})

app.get("/verifyemail/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const payload = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    console.log(payload)
    const userId = payload.id
    const user = await User.findById(userId)
    if(!user) throw new Error("Invalid token!")
    if(user.emailVerificationToken!=token) throw new Error("Invalid token!")
    user.isVerified = true;
    await user.save()
    res.status(200).send(`
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f8ff;
            color: #2e8b57;
          }
          .container {
            text-align: center;
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 36px;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Verification Successful!</h1>
          <p>Your account has been successfully verified.</p>
        </div>
      </body>
    </html>
  `);
  } catch (error) {
    res.status(401).json({status: "FAIL", messaeg: error.message})
  }
})

// const axios = require("axios")
// app.get("/pincode/:pincode", async (req,res, next)=>{
//   try {
//     let response = await axios.get("https://api.postalpincode.in/pincode/"+req.params.pincode)
//     console.log(response.data)
// res.send(response.data)
//   } catch (error) {
//     next(error)
//   }
// })
app.listen(8585, () => {
  console.log("Server is listening on port 8585.");
});


module.exports = app