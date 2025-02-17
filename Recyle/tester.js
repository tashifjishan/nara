
const crypto = require("crypto")

const randomString = crypto.randomBytes(32).toString("hex");

const hashedToken =  crypto
.createHash('sha256')
.update(randomString)
.digest('hex');

console.log(hashedToken)
console.log(randomString)

console.log(crypto
    .createHash('sha256')
    .update(randomString)
    .digest('hex'))