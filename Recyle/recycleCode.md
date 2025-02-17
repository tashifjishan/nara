// const areValidImages = async (images)=>{
//     try {
//         console.log(path.join(process.cwd(), "images", images[0]))
//         images.forEach(imageName=>sizeOf(path.join(process.cwd(), "images", imageName)));

//     } catch (error) {
//         console.log("At least one of the files is not a valid image")
//         console.log(error)
//     }
// }



exports.deleteFromCart = async (req, res, next) => {
  try {
    const { productId, size, userId } = req.body
    const updatedDocument = await User.findOneAndUpdate({
      _id: userId,
      "cart.productId": productId,
      "cart.size": size
    }, {
      $pull: { "cart": { productId: productId, size: size } }
    },
      { new: true }
    )

    if (!updatedDocument) throw new Error("Could not find the cart Itme")
    else res.json({ updatedDocument })
  } catch (error) {
    next(error)
  }
}