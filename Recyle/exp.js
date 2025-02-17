const crypto = require("crypto")

const message = "this is a message"
const secret = "thisIsSomeSecret@2134"

const expected = crypto.createHmac("sha256", secret).update(message.toString()).digest("hex")

console.log(expected)