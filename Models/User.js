const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const cartSchema = new mongoose.Schema({
  productId: String,
  size: String,
  image: String,
  title: String,
  quantity: Number
}) //Bad Schema, kyunki koi validation nhi hai

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  address1: String,
  address2: String,
  state: String,
  zip: String,
  city: String,
  isDefault: Boolean
}) //Bad Schema, kyunki koi validation nhi hai

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "User name must consist of at least 3 letters"],
    required: [true, "User name is required"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Phone number is required"],
    validate: [validator.isMobilePhone, "Please provide a valid phone number"],
  },
  password: {
    type: String,
    minlength: [8, "The password must contain at least 8 characters"],
    required: [true, "Password is required"],
    select: false,
  },
  role: {
    type: String,
    default: "user"
  },
  cart: [cartSchema],
  addresses: [addressSchema],
  emailVerificationToken: String,
  isVerified: {
    type: Boolean,
    default: false
  }
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("user", UserSchema);
module.exports = User;


