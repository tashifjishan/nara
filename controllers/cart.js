// Add an Item to the cart

// 1. Check if the item already exists in the cart by it's productId and Size
// 2. if it does increment the quantity
// 3. else add the item to the cart

// Increment / Decrement cartItem's quantity .... while decrementing if the item's quantity becomes 0, remove the item from the cart!
// remove an item from the cart
// read all items from a cart

const Product = require("../Models/Product")
const User = require("../Models/User")

exports.addToCart = async (req, res, next)=>{
    try {
      const {productId, size} = req.body;
      let userId = req.user._id;
  
      const product = await Product.findOne({_id: productId, "sizes": size})
      if(!product) throw new Error("The specified product variant is non-existant")

      // const user  = await User.findById(userId);
      // if(!user) throw new Error("User does not exist!")
      const user = req.user
      
      const itemIndex = user.cart.findIndex(el=>el.size===size && el.productId === productId)
      console.log(itemIndex)
      if(itemIndex != -1){
        user.cart[itemIndex].quantity++; 
        await user.save();
      }else{
        user.cart.push({productId, size, quantity: 1, title: product.title, image: product.images[0]});
        await user.save()
      }
      res.status(200).json({cart: user.cart})
    } catch (error) {
      // next(error)
      res.status(400).json({status: "FAIL", message: error.message})
    }
  }
 
  exports.updateQuantity = async (req, res, next) => {
    try {
      let {cartItemId, quantity } = req.body;
      let user= req.user
      if (isNaN(Math.floor(quantity))) throw new Error("Quantity must be a number")
      quantity = Math.floor(quantity);
      let cartItem = user.cart.id(cartItemId);
      if (!cartItem) throw new Error("Could not find the cart item")
  
      if (quantity < 0) {
        throw new Error("Quantity can't be negative")
      } else if (quantity === 0) {
        cartItem.deleteOne();
        await user.save()
        res.status(200).json({ status: "OK", message: user.cart });
      } else {
        cartItem.quantity = quantity;
        await user.save()
        res.status(200).json({ status: "OK", message: user.cart });
      }
    } catch (error) {
      res.status(400).json({status: "FAIL", message: error.message})
    }
  }