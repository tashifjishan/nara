const Razorpay = require('razorpay');
const dotenv = require("dotenv")
dotenv.config()
const razorpay = new Razorpay({
  key_id: process.env.RAZ_KEY_ID,
  key_secret: process.env.RAZ_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
      const options = {
        amount: req.body.amount, 
        currency: 'INR',
        receipt: 'receipt_' + Math.random().toString(36).substring(7),
        notes: req.body.notes
       
      };
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  exports.verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto.createHmac('sha256', process.env.RAZ_KEY_SECRET)
                              .update(sign.toString())
                              .digest('hex');
      if (razorpay_signature === expectedSign) {
        // Payment is verified
        res.status(200).json({ message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ error: 'Invalid payment signature' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  

  exports.getOrderDetails = async(req, res, next)=>{
    try {
      
      razorpay.orders.fetch(req.body.orderId).then(order => {
        const notes = order; // Retrieve the product ID from the notes
        res.status(200).json(notes)
        // Proceed with the rest of the payment handling logic
      });      
    } catch (error) {
      next(error)
    }
  }





  // Razorpay account creation
  // Payment Flow
  // Sending only product id  from the frontend!
  // completing the full purchase cycle like the database update

  /* 
  1. Order is created
  2. payment is initiated from the frontend for that order
  3. payement is verified
  4. After the successfull verification the item is stored in the orders
  array of the customer and also that of the merchant(the admin account!)
  */