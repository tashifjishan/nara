const AppError = require("../utils/AppError")
exports.addAddress = async (req, res, next)=>{
   try {
    const user = req.user;
    const address = req.body;
    user.addresses.push({
        "firstName": address.firstName,
        "lastName": address.lastName,
        "phone": address.phone,
        "address1": address.address1,
        "address2": address.address2,
        "zip": address.zip,
        "city": address.city,
        "state": address.state,
        isDefault: user.addresses.length>0 ? false: true
      });
    await user.save()
    res.status(200).json({status: "OK", message: user.addresses})

   } catch (error) {
    next(error)
   }
}

exports.deleteAddress = async (req, res, next)=>{
    try {
        const user = req.user;
        user.addresses.id(req.query.id).deleteOne();
        
        await user.save()
        res.status(200).json({status: "No Content", message: req.query.id})

    } catch (error) {
        next(error)
    }
}

exports.markAsDefault = async(req, res, next)=>{
    try {
        const user = req.user;
        if(user.addresses.length===0) throw new AppError("The user has not added any address yet!", 404)
        const currentDefaultAddress = user.addresses.find(address=>address.isDefault==true) 
        const address = user.addresses.id(req.query.id);
        // remove the current default address
        if(!address) throw new AppError("Invalid address id", 404)

        currentDefaultAddress.isDefault = false;
        address.isDefault = true;
        await user.save();
        res.status(200).json({status: "OK", message: user.addresses});
    } catch (error) {
        next(error)
    }
}

exports.getUserInfo = (req, res, next)=>{
    try {
        const user = req.user;
        
        res.status(200).json({status: "OK", message: user})
    } catch (error) {
        next(error)
    }
}


// {
//     "firstName": "Tashif",
//     "lastName": "Iqbal",
//     "phone": "+918210853664",
//     "address1": "ward no. 45, shyampur, harinagar-845105",
//     "address2": "east champaran, bihar, india",
//     "zip": "845105",
//     "city": "someCity",
//     "state": "Bihar"
//   }